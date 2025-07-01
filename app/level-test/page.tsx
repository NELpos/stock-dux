"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// 문제 데이터 타입에 explanation 추가
interface Question {
  id: number;
  term: string;
  definition: string;
  options: string[];
  correctAnswer: number;
  difficulty: "low" | "medium" | "high";
  category: "제테크" | "미국주식";
  explanation: string;
}

// 실제 경제/주식 용어 문제들 (해설 추가)
const questions: Question[] = [
  {
    id: 1,
    term: "P/E Ratio",
    definition: "주가수익비율로, 주가를 주당순이익으로 나눈 값",
    options: [
      "주가를 주당순이익으로 나눈 값",
      "순이익을 총자산으로 나눈 값",
      "부채를 자기자본으로 나눈 값",
      "매출을 총자산으로 나눈 값",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    category: "미국주식",
    explanation:
      "P/E Ratio(Price-to-Earnings Ratio)는 주가수익비율로, 현재 주가가 주당순이익(EPS)의 몇 배인지를 나타냅니다. 이 지표는 주식이 고평가되었는지 저평가되었는지를 판단하는 데 사용되며, 일반적으로 P/E 비율이 낮을수록 상대적으로 저평가된 것으로 간주됩니다.",
  },
  {
    id: 2,
    term: "Bull Market",
    definition: "주식시장이 상승세를 보이는 시장 상황",
    options: [
      "주식시장이 하락세를 보이는 상황",
      "주식시장이 상승세를 보이는 상황",
      "주식시장이 횡보하는 상황",
      "주식시장이 변동성이 큰 상황",
    ],
    correctAnswer: 1,
    difficulty: "low",
    category: "미국주식",
    explanation:
      "Bull Market(강세장)은 주식시장이 지속적으로 상승하는 시장 상황을 의미합니다. 반대로 Bear Market(약세장)은 하락하는 시장을 의미합니다. 황소(Bull)가 뿔로 위로 들이받는 모습에서 유래되었습니다.",
  },
  {
    id: 3,
    term: "복리",
    definition: "원금에 이자가 더해져서 불어난 금액에 다시 이자가 붙는 것",
    options: [
      "원금에만 이자가 붙는 것",
      "원금에 이자가 더해져서 불어난 금액에 다시 이자가 붙는 것",
      "이자율이 고정되어 있는 것",
      "이자율이 변동되는 것",
    ],
    correctAnswer: 1,
    difficulty: "low",
    category: "제테크",
    explanation:
      "복리는 '이자에 이자가 붙는' 개념으로, 시간이 지날수록 기하급수적으로 자산이 증가하는 효과를 가져옵니다. 아인슈타인이 '세상에서 가장 강력한 힘'이라고 표현했을 정도로 장기 투자에서 중요한 개념입니다.",
  },
  {
    id: 4,
    term: "ETF",
    definition: "상장지수펀드로, 특정 지수를 추종하는 펀드",
    options: [
      "개별 주식을 직접 매매하는 것",
      "특정 지수를 추종하는 펀드",
      "부동산에 투자하는 펀드",
      "채권에만 투자하는 펀드",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "미국주식",
    explanation:
      "ETF(Exchange Traded Fund)는 특정 지수(예: S&P 500)를 추종하는 펀드로, 주식처럼 거래소에서 실시간으로 매매할 수 있습니다. 분산투자 효과를 얻으면서도 낮은 수수료와 높은 유동성을 제공합니다.",
  },
  {
    id: 5,
    term: "Dollar Cost Averaging",
    definition: "정기적으로 일정 금액을 투자하는 전략",
    options: [
      "한 번에 큰 금액을 투자하는 것",
      "정기적으로 일정 금액을 투자하는 전략",
      "가격이 떨어질 때만 투자하는 것",
      "가격이 오를 때만 투자하는 것",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "제테크",
    explanation:
      "달러 코스트 애버리징(DCA)은 시장 타이밍을 맞추려 하지 않고 정기적으로 일정 금액을 투자하는 전략입니다. 가격이 높을 때는 적게, 낮을 때는 많이 사게 되어 평균 매입 단가를 낮추는 효과가 있습니다.",
  },
  {
    id: 6,
    term: "Dividend Yield",
    definition: "배당수익률로, 연간 배당금을 주가로 나눈 비율",
    options: [
      "연간 배당금을 주가로 나눈 비율",
      "주가를 배당금으로 나눈 비율",
      "순이익을 주가로 나눈 비율",
      "매출을 주가로 나눈 비율",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    category: "미국주식",
    explanation:
      "배당수익률은 투자한 금액 대비 얼마나 많은 배당을 받을 수 있는지를 나타내는 지표입니다. 예를 들어, 주가가 100달러이고 연간 배당이 4달러라면 배당수익률은 4%입니다.",
  },
  {
    id: 7,
    term: "자산배분",
    definition: "투자자금을 여러 자산에 분산하여 투자하는 전략",
    options: [
      "한 종목에만 집중 투자하는 것",
      "투자자금을 여러 자산에 분산하여 투자하는 전략",
      "현금만 보유하는 것",
      "부채를 늘려서 투자하는 것",
    ],
    correctAnswer: 1,
    difficulty: "low",
    category: "제테크",
    explanation:
      "자산배분은 '계란을 한 바구니에 담지 말라'는 격언처럼, 투자 위험을 분산시키기 위해 주식, 채권, 부동산 등 다양한 자산에 투자하는 전략입니다. 이를 통해 전체 포트폴리오의 변동성을 줄일 수 있습니다.",
  },
  {
    id: 8,
    term: "Market Cap",
    definition: "시가총액으로, 주가에 발행주식수를 곱한 값",
    options: [
      "주가에 발행주식수를 곱한 값",
      "순이익에 발행주식수를 곱한 값",
      "매출에 발행주식수를 곱한 값",
      "자산에 발행주식수를 곱한 값",
    ],
    correctAnswer: 0,
    difficulty: "low",
    category: "미국주식",
    explanation:
      "시가총액(Market Capitalization)은 기업의 전체 가치를 나타내는 지표로, 현재 주가에 발행된 총 주식 수를 곱한 값입니다. 대형주, 중형주, 소형주를 구분하는 기준으로도 사용됩니다.",
  },
  {
    id: 9,
    term: "REIT",
    definition: "부동산투자신탁으로, 부동산에 투자하는 펀드",
    options: [
      "주식에만 투자하는 펀드",
      "채권에만 투자하는 펀드",
      "부동산에 투자하는 펀드",
      "원자재에 투자하는 펀드",
    ],
    correctAnswer: 2,
    difficulty: "medium",
    category: "제테크",
    explanation:
      "REIT(Real Estate Investment Trust)는 부동산투자신탁으로, 개인이 직접 부동산을 구매하지 않고도 부동산 투자의 수익을 얻을 수 있게 해주는 금융상품입니다. 일반적으로 높은 배당수익률을 제공합니다.",
  },
  {
    id: 10,
    term: "Volatility",
    definition: "주가의 변동성을 나타내는 지표",
    options: [
      "주가의 평균값을 나타내는 지표",
      "주가의 변동성을 나타내는 지표",
      "주가의 최고값을 나타내는 지표",
      "주가의 최저값을 나타내는 지표",
    ],
    correctAnswer: 1,
    difficulty: "high",
    category: "미국주식",
    explanation:
      "변동성(Volatility)은 주가가 얼마나 크게 움직이는지를 나타내는 지표입니다. 높은 변동성은 큰 수익 기회와 동시에 큰 손실 위험을 의미하며, VIX 지수 등으로 측정됩니다.",
  },
  {
    id: 11,
    term: "긴급자금",
    definition: "예상치 못한 상황에 대비한 비상자금",
    options: [
      "투자용 자금",
      "예상치 못한 상황에 대비한 비상자금",
      "여행용 자금",
      "쇼핑용 자금",
    ],
    correctAnswer: 1,
    difficulty: "low",
    category: "제테크",
    explanation:
      "긴급자금은 실직, 질병, 응급상황 등 예상치 못한 상황에 대비한 자금으로, 일반적으로 3-6개월치 생활비에 해당하는 금액을 현금성 자산으로 보유하는 것이 권장됩니다.",
  },
  {
    id: 12,
    term: "Beta",
    definition:
      "개별 주식이 시장 전체 대비 얼마나 민감하게 반응하는지를 나타내는 지표",
    options: [
      "개별 주식의 수익률을 나타내는 지표",
      "개별 주식이 시장 전체 대비 얼마나 민감하게 반응하는지를 나타내는 지표",
      "개별 주식의 배당률을 나타내는 지표",
      "개별 주식의 거래량을 나타내는 지표",
    ],
    correctAnswer: 1,
    difficulty: "high",
    category: "미국주식",
    explanation:
      "베타(Beta)는 개별 주식이 시장 전체의 움직임에 얼마나 민감하게 반응하는지를 나타냅니다. 베타가 1이면 시장과 동일하게 움직이고, 1보다 크면 시장보다 변동성이 크며, 1보다 작으면 상대적으로 안정적입니다.",
  },
  {
    id: 13,
    term: "인플레이션",
    definition: "물가가 지속적으로 상승하는 현상",
    options: [
      "물가가 지속적으로 하락하는 현상",
      "물가가 지속적으로 상승하는 현상",
      "물가가 변동하지 않는 현상",
      "물가가 급격히 변동하는 현상",
    ],
    correctAnswer: 1,
    difficulty: "low",
    category: "제테크",
    explanation:
      "인플레이션은 물가가 지속적으로 상승하는 현상으로, 화폐의 구매력이 감소함을 의미합니다. 적정 수준의 인플레이션은 경제 성장의 신호이지만, 과도한 인플레이션은 경제에 부정적 영향을 미칩니다.",
  },
  {
    id: 14,
    term: "Short Selling",
    definition: "주식을 빌려서 팔고 나중에 사서 갚는 투자 전략",
    options: [
      "주식을 사서 오래 보유하는 전략",
      "주식을 빌려서 팔고 나중에 사서 갚는 투자 전략",
      "주식을 분할 매수하는 전략",
      "주식을 분할 매도하는 전략",
    ],
    correctAnswer: 1,
    difficulty: "high",
    category: "미국주식",
    explanation:
      "공매도(Short Selling)는 주가 하락을 예상할 때 사용하는 전략으로, 주식을 빌려서 먼저 팔고 나중에 더 낮은 가격에 사서 갚는 방식입니다. 높은 위험을 수반하며 무한 손실 가능성이 있습니다.",
  },
  {
    id: 15,
    term: "포트폴리오",
    definition: "투자자가 보유한 다양한 투자자산의 조합",
    options: [
      "투자자가 보유한 다양한 투자자산의 조합",
      "투자자가 보유한 현금의 총액",
      "투자자가 보유한 부채의 총액",
      "투자자가 보유한 부동산의 총액",
    ],
    correctAnswer: 0,
    difficulty: "low",
    category: "제테크",
    explanation:
      "포트폴리오는 투자자가 보유한 모든 투자자산(주식, 채권, 부동산 등)의 조합을 의미합니다. 효율적인 포트폴리오 구성을 통해 위험을 분산시키고 수익을 최적화할 수 있습니다.",
  },
  {
    id: 16,
    term: "IPO",
    definition: "기업이 처음으로 주식을 공개하여 상장하는 것",
    options: [
      "기업이 주식을 분할하는 것",
      "기업이 처음으로 주식을 공개하여 상장하는 것",
      "기업이 주식을 재매입하는 것",
      "기업이 배당을 지급하는 것",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "미국주식",
    explanation:
      "IPO(Initial Public Offering)는 기업이 처음으로 주식을 일반 투자자들에게 공개하여 증권거래소에 상장하는 과정입니다. 이를 통해 기업은 자금을 조달하고 투자자들은 해당 기업의 주주가 될 수 있습니다.",
  },
  {
    id: 17,
    term: "리밸런싱",
    definition: "포트폴리오의 자산 비중을 원래 목표로 조정하는 것",
    options: [
      "포트폴리오를 완전히 새로 구성하는 것",
      "포트폴리오의 자산 비중을 원래 목표로 조정하는 것",
      "포트폴리오에서 모든 자산을 매도하는 것",
      "포트폴리오에 새로운 자산만 추가하는 것",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "제테크",
    explanation:
      "리밸런싱은 시간이 지나면서 변화된 자산 비중을 원래 목표 비중으로 되돌리는 과정입니다. 예를 들어, 주식 60% 채권 40%로 시작했는데 주식이 상승해서 70% 30%가 되었다면, 일부 주식을 팔고 채권을 사서 원래 비중으로 맞춥니다.",
  },
  {
    id: 18,
    term: "Earnings Per Share (EPS)",
    definition: "주당순이익으로, 순이익을 발행주식수로 나눈 값",
    options: [
      "매출을 발행주식수로 나눈 값",
      "순이익을 발행주식수로 나눈 값",
      "자산을 발행주식수로 나눈 값",
      "부채를 발행주식수로 나눈 값",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    category: "미국주식",
    explanation:
      "주당순이익(EPS)은 기업의 순이익을 발행주식수로 나눈 값으로, 주주 1주당 얼마의 이익을 창출했는지를 나타냅니다. EPS가 높을수록 기업의 수익성이 좋다고 평가되며, P/E 비율 계산의 기초가 됩니다.",
  },
  {
    id: 19,
    term: "세금 최적화",
    definition: "합법적인 방법으로 세금 부담을 최소화하는 전략",
    options: [
      "세금을 전혀 내지 않는 것",
      "합법적인 방법으로 세금 부담을 최소화하는 전략",
      "세금을 더 많이 내는 것",
      "세금 신고를 하지 않는 것",
    ],
    correctAnswer: 1,
    difficulty: "high",
    category: "제테크",
    explanation:
      "세금 최적화는 합법적인 범위 내에서 세금 부담을 최소화하는 전략입니다. 연금저축, ISA, 장기투자를 통한 세제혜택 활용, 손익통산 등의 방법이 있으며, 탈세와는 구별되는 합법적인 절세 방법입니다.",
  },
  {
    id: 20,
    term: "Options Trading",
    definition: "특정 가격에 주식을 사거나 팔 수 있는 권리를 거래하는 것",
    options: [
      "주식을 직접 사고파는 것",
      "특정 가격에 주식을 사거나 팔 수 있는 권리를 거래하는 것",
      "주식을 빌려서 거래하는 것",
      "주식을 분할해서 거래하는 것",
    ],
    correctAnswer: 1,
    difficulty: "high",
    category: "미국주식",
    explanation:
      "옵션 거래는 특정 기간 내에 특정 가격으로 주식을 사거나 팔 수 있는 권리를 거래하는 파생상품입니다. 콜옵션(매수권)과 풋옵션(매도권)이 있으며, 레버리지 효과로 인해 높은 수익과 손실 가능성을 모두 가지고 있습니다.",
  },
];

export default function LevelTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set()
  );

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    const wrongAnswers: any[] = [];

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      } else {
        // 틀린 문제를 오답 노트에 저장
        wrongAnswers.push({
          question: question,
          userAnswer: selectedAnswers[index],
          attempts: 1,
          lastAttempt: new Date().toISOString(),
        });
      }
    });

    // localStorage에 오답 저장 (기존 오답과 합치기)
    const existingWrongAnswers = JSON.parse(
      localStorage.getItem("wrongAnswers") || "[]"
    );
    const allWrongAnswers = [...existingWrongAnswers];

    wrongAnswers.forEach((newWrong) => {
      const existingIndex = allWrongAnswers.findIndex(
        (existing) => existing.question.id === newWrong.question.id
      );
      if (existingIndex >= 0) {
        // 이미 있는 문제면 시도 횟수만 증가
        allWrongAnswers[existingIndex].attempts += 1;
        allWrongAnswers[existingIndex].lastAttempt = newWrong.lastAttempt;
        allWrongAnswers[existingIndex].userAnswer = newWrong.userAnswer;
      } else {
        // 새로운 틀린 문제면 추가
        allWrongAnswers.push(newWrong);
      }
    });

    localStorage.setItem("wrongAnswers", JSON.stringify(allWrongAnswers));

    return correctCount;
  };

  const getLevel = (score: number) => {
    if (score < 10)
      return { level: "초급자", color: "bg-red-500", icon: BookOpen };
    if (score < 15)
      return { level: "중급자", color: "bg-yellow-500", icon: Target };
    return { level: "고급자", color: "bg-green-500", icon: Trophy };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "초급";
      case "medium":
        return "중급";
      case "high":
        return "고급";
      default:
        return "알 수 없음";
    }
  };

  const toggleQuestionExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  if (!testStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Level Test</h1>
          <p className="text-muted-foreground">
            제테크와 미국주식 투자 지식을 테스트해보세요.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              투자 지식 레벨 테스트
            </CardTitle>
            <CardDescription>
              총 20개의 문제를 통해 당신의 투자 지식 수준을 확인해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">초급</Badge>
                <span className="text-sm">기본적인 투자 용어</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">중급</Badge>
                <span className="text-sm">투자 전략 및 분석 지표</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">고급</Badge>
                <span className="text-sm">고급 투자 기법 및 파생상품</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">레벨 분류 기준:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 10개 미만 정답: 초급자</li>
                <li>• 10-14개 정답: 중급자</li>
                <li>• 15개 이상 정답: 고급자</li>
              </ul>
            </div>

            <Button
              onClick={() => setTestStarted(true)}
              className="w-full"
              size="lg"
            >
              테스트 시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateResults();
    const { level, color, icon: LevelIcon } = getLevel(score);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">테스트 결과</h1>
          <p className="text-muted-foreground">
            당신의 투자 지식 레벨이 확인되었습니다.
          </p>
        </div>

        <Card className="max-w-4xl">
          <CardHeader className="text-center">
            <div
              className={`w-20 h-20 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <LevelIcon className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">당신은 {level}입니다!</CardTitle>
            <CardDescription>
              20문제 중 {score}개 정답 ({percentage}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={percentage} className="h-3" />

            <div className="grid gap-4">
              <h4 className="font-medium">문제별 결과 (클릭하여 해설 보기):</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const isCorrect =
                    selectedAnswers[index] === question.correctAnswer;
                  const isExpanded = expandedQuestions.has(question.id);
                  const userAnswer = selectedAnswers[index];

                  return (
                    <div key={question.id} className="border rounded-lg">
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleQuestionExpansion(question.id)}
                      >
                        <div className="flex items-center gap-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {question.term}
                            </span>
                            <Badge
                              className={getDifficultyColor(
                                question.difficulty
                              )}
                            >
                              {getDifficultyText(question.difficulty)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{question.category}</Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3 pb-3 border-t bg-gray-50">
                          <div className="pt-3 space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-2">
                                문제:
                              </h5>
                              <p className="text-sm text-gray-700">
                                {question.term}의 의미는?
                              </p>
                            </div>

                            <div>
                              <h5 className="font-medium text-sm mb-2">
                                선택지:
                              </h5>
                              <div className="space-y-1">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`text-sm p-2 rounded ${
                                      optionIndex === question.correctAnswer
                                        ? "bg-green-100 text-green-800 font-medium"
                                        : optionIndex === userAnswer &&
                                          !isCorrect
                                        ? "bg-red-100 text-red-800"
                                        : "bg-white"
                                    }`}
                                  >
                                    <span className="font-medium mr-2">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                                    {option}
                                    {optionIndex === question.correctAnswer && (
                                      <span className="ml-2 text-green-600">
                                        ✓ 정답
                                      </span>
                                    )}
                                    {optionIndex === userAnswer &&
                                      !isCorrect && (
                                        <span className="ml-2 text-red-600">
                                          ✗ 선택한 답
                                        </span>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-sm mb-2">
                                해설:
                              </h5>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                  setShowResults(false);
                  setTestStarted(false);
                  setExpandedQuestions(new Set());
                }}
                variant="outline"
                className="flex-1"
              >
                다시 테스트하기
              </Button>
              <Button
                onClick={() => (window.location.href = "/wrong-answers")}
                variant="outline"
                className="flex-1"
              >
                오답 노트 보기
              </Button>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex-1"
              >
                대시보드로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Level Test</h1>
          <p className="text-muted-foreground">
            문제 {currentQuestion + 1} / {questions.length}
          </p>
        </div>
        <Badge className={getDifficultyColor(question.difficulty)}>
          {getDifficultyText(question.difficulty)}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{question.term}</CardTitle>
            <Badge variant="outline">{question.category}</Badge>
          </div>
          <CardDescription>
            다음 용어의 의미로 가장 적절한 것을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswers[currentQuestion] === index
                    ? "default"
                    : "outline"
                }
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              이전
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === questions.length - 1 ? "결과 보기" : "다음"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
