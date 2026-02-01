-- ============================================
-- InvestFlow - Supabase 초기화 SQL
-- ============================================
-- Supabase SQL Editor에서 실행하세요.

-- 1. 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 화이트리스트 테이블 (허용된 사용자 이메일)
CREATE TABLE IF NOT EXISTS whitelist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 화이트리스트 (필요시 수정)
-- INSERT INTO whitelist (email) VALUES 
--   ('user1@naver.com'),
--   ('user2@kakao.com');

-- 3. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  provider TEXT, -- 'google' | 'naver' | 'kakao'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 증권사 연동 정보
CREATE TABLE IF NOT EXISTS broker_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'kis', -- 한국투자증권
  account_no TEXT,
  access_token TEXT, -- 암호화 저장 권장
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- 5. 포트폴리오 테이블
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  name TEXT,
  quantity DECIMAL(18, 8) NOT NULL DEFAULT 0,
  avg_price DECIMAL(18, 4) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD', -- 'USD' | 'KRW'
  asset_type TEXT NOT NULL DEFAULT 'US_STOCK', -- 'US_STOCK' | 'KR_ETF'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- 6. 거래 내역 테이블
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  transaction_type TEXT NOT NULL, -- 'BUY' | 'SELL'
  quantity DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  fee DECIMAL(18, 4) DEFAULT 0,
  executed_at TIMESTAMPTZ NOT NULL,
  synced_from TEXT DEFAULT 'MANUAL', -- 'KIS_API' | 'MANUAL'
  external_id TEXT, -- 외부 시스템 거래 ID (중복 방지)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, external_id)
);

-- 7. 뉴스 캐시 테이블
CREATE TABLE IF NOT EXISTS news_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker TEXT NOT NULL,
  title TEXT NOT NULL,
  summary_ko TEXT, -- 한국어 요약
  sentiment TEXT, -- 'positive' | 'negative' | 'neutral'
  source TEXT,
  source_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ticker, source_url)
);

-- 8. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ticker ON transactions(ticker);
CREATE INDEX IF NOT EXISTS idx_transactions_executed_at ON transactions(executed_at);
CREATE INDEX IF NOT EXISTS idx_news_cache_ticker ON news_cache(ticker);
CREATE INDEX IF NOT EXISTS idx_news_cache_published_at ON news_cache(published_at);

-- ============================================
-- Row Level Security (RLS) 정책
-- ============================================

-- profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- broker_connections RLS
ALTER TABLE broker_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own broker connections"
  ON broker_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own broker connections"
  ON broker_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own broker connections"
  ON broker_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own broker connections"
  ON broker_connections FOR DELETE
  USING (auth.uid() = user_id);

-- portfolios RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- transactions RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- news_cache는 공개 (모든 사용자 접근 가능)
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news cache"
  ON news_cache FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 트리거: 자동 updated_at 갱신
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER broker_connections_updated_at
  BEFORE UPDATE ON broker_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 트리거: 신규 사용자 자동 프로필 생성
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_whitelisted BOOLEAN;
BEGIN
  -- 화이트리스트 확인
  SELECT EXISTS (
    SELECT 1 FROM whitelist WHERE email = NEW.email
  ) INTO is_whitelisted;
  
  -- 화이트리스트에 있으면 프로필 생성
  IF is_whitelisted THEN
    INSERT INTO profiles (id, email, name, avatar_url, provider)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_app_meta_data->>'provider'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거 삭제 (있으면)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 새 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 화이트리스트 검증 함수
-- ============================================

CREATE OR REPLACE FUNCTION is_user_whitelisted(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM whitelist WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 초기 데이터 (테스트용, 필요시 수정)
-- ============================================

-- 화이트리스트에 테스트 이메일 추가
-- INSERT INTO whitelist (email) VALUES 
--   ('test@naver.com'),
--   ('test@kakao.com');

-- ============================================
-- 완료 메시지
-- ============================================
-- 실행 완료! 다음 단계:
-- 1. Supabase Dashboard > Authentication > Providers에서 Google, Naver, Kakao 활성화
-- 2. whitelist 테이블에 허용할 이메일 추가
-- 3. .env.local에 Supabase 키 설정
