"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Trash2,
} from "lucide-react";

// Level Test의 문제 데이터 타입 재사용
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

interface WrongAnswer {
  question: Question;
  userAnswer: number;
  attempts: number;
  lastAttempt: string;
}

export default function WrongAnswersPage() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reviewMode, setReviewMode] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    // localStorage에서 오답 데이터 불러오기
    const savedWrongAnswers = localStorage.getItem("wrongAnswers");
    if (savedWrongAnswers) {
      setWrongAnswers(JSON.parse(savedWrongAnswers));
    }
  }, []);

  const saveWrongAnswers = (answers: WrongAnswer[]) => {
    localStorage.setItem("wrongAnswers", JSON.stringify(answers));
    setWrongAnswers(answers);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const question = wrongAnswers[currentQuestion];
    const correct = selectedAnswer === question.question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // 정답을 맞혔으면 오답 노트에서 제거
      const updatedWrongAnswers = wrongAnswers.filter(
        (_, index) => index !== currentQuestion
      );
      saveWrongAnswers(updatedWrongAnswers);

      setTimeout(() => {
        if (updatedWrongAnswers.length === 0) {
          setReviewMode(true);
          setCurrentQuestion(0);
        } else if (currentQuestion >= updatedWrongAnswers.length) {
          setCurrentQuestion(0);
        }
        setSelectedAnswer(null);
        setShowResult(false);
      }, 2000);
    } else {
      // 틀렸으면 시도 횟수 증가
      const updatedWrongAnswers = [...wrongAnswers];
      updatedWrongAnswers[currentQuestion] = {
        ...question,
        attempts: question.attempts + 1,
        lastAttempt: new Date().toISOString(),
      };
      saveWrongAnswers(updatedWrongAnswers);

      setTimeout(() => {
        setSelectedAnswer(null);
        setShowResult(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentQuestion < wrongAnswers.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const clearAllWrongAnswers = () => {
    localStorage.removeItem("wrongAnswers");
    setWrongAnswers([]);
    setReviewMode(true);
  };

  const removeWrongAnswer = (index: number) => {
    const updatedWrongAnswers = wrongAnswers.filter((_, i) => i !== index);
    saveWrongAnswers(updatedWrongAnswers);
    if (
      currentQuestion >= updatedWrongAnswers.length &&
      updatedWrongAnswers.length > 0
    ) {
      setCurrentQuestion(updatedWrongAnswers.length - 1);
    }
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

  if (wrongAnswers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">오답 노트</h1>
          <p className="text-muted-foreground">
            틀린 문제들을 복습하고 다시 도전해보세요.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">완벽합니다! 🎉</CardTitle>
            <CardDescription>현재 복습할 틀린 문제가 없습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Level Test를 다시 풀어보거나 새로운 도전을 해보세요!
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => (window.location.href = "/level-test")}
                  className="flex-1"
                >
                  Level Test 다시 풀기
                </Button>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  variant="outline"
                  className="flex-1"
                >
                  대시보드로 이동
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">오답 노트</h1>
            <p className="text-muted-foreground">
              총 {wrongAnswers.length}개의 틀린 문제가 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setReviewMode(false)}
              disabled={wrongAnswers.length === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              다시 풀기
            </Button>
            <Button
              onClick={clearAllWrongAnswers}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              전체 삭제
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <h4 className="font-medium">틀린 문제 목록 (클릭하여 해설 보기):</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {wrongAnswers.map((wrongAnswer, index) => {
              const isExpanded = expandedQuestions.has(wrongAnswer.question.id);

              return (
                <div
                  key={wrongAnswer.question.id}
                  className="border rounded-lg"
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      toggleQuestionExpansion(wrongAnswer.question.id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {wrongAnswer.question.term}
                        </span>
                        <Badge
                          className={getDifficultyColor(
                            wrongAnswer.question.difficulty
                          )}
                        >
                          {getDifficultyText(wrongAnswer.question.difficulty)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {wrongAnswer.question.category}
                      </Badge>
                      <Badge variant="secondary">
                        시도 {wrongAnswer.attempts}회
                      </Badge>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWrongAnswer(index);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                          <h5 className="font-medium text-sm mb-2">문제:</h5>
                          <p className="text-sm text-gray-700">
                            {wrongAnswer.question.term}의 의미는?
                          </p>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm mb-2">선택지:</h5>
                          <div className="space-y-1">
                            {wrongAnswer.question.options.map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`text-sm p-2 rounded ${
                                    optionIndex ===
                                    wrongAnswer.question.correctAnswer
                                      ? "bg-green-100 text-green-800 font-medium"
                                      : optionIndex === wrongAnswer.userAnswer
                                      ? "bg-red-100 text-red-800"
                                      : "bg-white"
                                  }`}
                                >
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  {option}
                                  {optionIndex ===
                                    wrongAnswer.question.correctAnswer && (
                                    <span className="ml-2 text-green-600">
                                      ✓ 정답
                                    </span>
                                  )}
                                  {optionIndex === wrongAnswer.userAnswer && (
                                    <span className="ml-2 text-red-600">
                                      ✗ 선택한 답
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm mb-2">해설:</h5>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {wrongAnswer.question.explanation}
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
      </div>
    );
  }

  // 문제 풀기 모드
  const question = wrongAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / wrongAnswers.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">오답 노트 - 다시 풀기</h1>
          <p className="text-muted-foreground">
            문제 {currentQuestion + 1} / {wrongAnswers.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getDifficultyColor(question.question.difficulty)}>
            {getDifficultyText(question.question.difficulty)}
          </Badge>
          <Button
            onClick={() => setReviewMode(true)}
            variant="outline"
            size="sm"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{question.question.term}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{question.question.category}</Badge>
              <Badge variant="secondary">시도 {question.attempts}회</Badge>
            </div>
          </div>
          <CardDescription>
            다음 용어의 의미로 가장 적절한 것을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {question.question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  showResult
                    ? index === question.question.correctAnswer
                      ? "bg-green-100 border-green-500 text-green-800"
                      : index === selectedAnswer && !isCorrect
                      ? "bg-red-100 border-red-500 text-red-800"
                      : ""
                    : ""
                }`}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && index === question.question.correctAnswer && (
                  <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
                )}
                {showResult && index === selectedAnswer && !isCorrect && (
                  <XCircle className="ml-auto h-4 w-4 text-red-600" />
                )}
              </Button>
            ))}
          </div>

          {showResult && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span
                  className={`font-medium ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect
                    ? "정답입니다! 🎉"
                    : "틀렸습니다. 다시 도전해보세요!"}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>해설:</strong> {question.question.explanation}
              </p>
              {isCorrect && (
                <p className="text-sm text-green-600 mt-2">
                  이 문제가 오답 노트에서 제거됩니다.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={showResult}
            >
              이전
            </Button>
            <div className="flex gap-2">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                >
                  제출
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestion === wrongAnswers.length - 1
                    ? "처음으로"
                    : "다음"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
