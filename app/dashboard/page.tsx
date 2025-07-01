import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          주식 관리 대시보드에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 통계 카드들 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 포트폴리오 가치
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩45,231,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.1%</span> 전월 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">보유 종목 수</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> 이번 달 추가
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일일 수익률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+₩1,086,000</span> 오늘
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 알림</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">3개</span> 긴급 알림
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 거래</CardTitle>
            <CardDescription>최근 7일간의 거래 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">삼성전자</p>
                  <p className="text-sm text-muted-foreground">매수 • 10주</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₩750,000</p>
                  <p className="text-sm text-green-600">+2.1%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SK하이닉스</p>
                  <p className="text-sm text-muted-foreground">매도 • 5주</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₩650,000</p>
                  <p className="text-sm text-red-600">-1.5%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">NAVER</p>
                  <p className="text-sm text-muted-foreground">매수 • 3주</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₩450,000</p>
                  <p className="text-sm text-green-600">+3.2%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시장 동향</CardTitle>
            <CardDescription>주요 지수 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">KOSPI</p>
                  <p className="text-sm text-muted-foreground">
                    한국종합주가지수
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">2,456.78</p>
                  <p className="text-sm text-green-600">+1.2%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">KOSDAQ</p>
                  <p className="text-sm text-muted-foreground">코스닥지수</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">876.45</p>
                  <p className="text-sm text-red-600">-0.8%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">USD/KRW</p>
                  <p className="text-sm text-muted-foreground">달러 환율</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">1,345.50</p>
                  <p className="text-sm text-green-600">+0.3%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
