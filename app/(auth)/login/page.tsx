import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            로그인
          </CardTitle>
          <CardDescription className="text-center">
            계정에 로그인하여 서비스를 이용하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-white text-gray-700 hover:bg-gray-50"
              type="button"
            >
              <Mail className="mr-2 h-4 w-4" />
              Gmail로 로그인
            </Button>
            <Button
              variant="outline"
              className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 border-yellow-400"
              type="button"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              카카오로 로그인
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                또는 이메일로 로그인
              </span>
            </div>
          </div>

          {/* 이메일/패스워드 로그인 폼 */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
