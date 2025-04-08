"use client";

import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";

interface AnalysisResult {
  emotions: Array<{
    emoji: string;
    text: string;
    value: number;
  }>;
  solution: {
    title: string;
    description: string;
  };
}

const EMOTIONS = [
  { emoji: "😌", text: "평온하다" },
  { emoji: "😪", text: "피곤하다" },
  { emoji: "😰", text: "불안하다" },
  { emoji: "😤", text: "화나다" },
  { emoji: "😢", text: "슬프다" },
];

export default function Check() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [formData, setFormData] = useState({
    emotion: "",
    stressLevel: 50,
    description: "",
  });
  const router = useRouter();

  const analyzeEmotion = async (isRetry: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error("Analysis failed");

      setAnalysisResult(result);
      if (!isRetry) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: "현재 기분과 가장\n가까운 것을 골라주세요",
      component: (
        <div className="grid grid-cols-3 gap-4">
          {EMOTIONS.map((item) => (
            <Button
              key={item.text}
              variant="outline"
              className={`flex h-24 flex-col items-center gap-2 p-2 hover:bg-[#4E80EE]/10 ${
                formData.emotion === item.text
                  ? "bg-[#4E80EE] text-white hover:bg-[#4E80EE]/90"
                  : ""
              }`}
              onClick={() => setFormData({ ...formData, emotion: item.text })}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-sm">{item.text}</span>
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "현재 나의 스트레스\n레벨을 표시해주세요",
      component: (
        <div className="space-y-8">
          <Card className="border-none bg-[#F9FAFB]">
            <CardContent className="pt-6">
              <div className="relative mx-auto aspect-[3/2] w-full max-w-[300px]">
                <Image
                  src="/bed.png"
                  alt="relaxing"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <Slider
                defaultValue={[formData.stressLevel]}
                value={[formData.stressLevel]}
                max={100}
                step={1}
                onValueChange={(value) =>
                  setFormData({ ...formData, stressLevel: value[0] })
                }
                className="mt-8"
              />
              <div className="mt-2 flex justify-between text-sm text-[#6B7280]">
                <span>매우 낮음</span>
                <span>보통</span>
                <span>매우 높음</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      title: "지금의 감정을\n자유롭게 작성해주세요",
      component: (
        <div className="space-y-4">
          <Card className="border-none bg-[#F9FAFB]">
            <CardContent className="pt-6">
              <p className="text-sm text-[#6B7280]">
                예: 우울하고 기운이 없어요.
              </p>
            </CardContent>
          </Card>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="자유롭게 작성해주세요..."
            className="h-32 resize-none focus-visible:ring-[#4E80EE]"
          />
        </div>
      ),
    },
    {
      title: "분석 결과입니다",
      component: (
        <div className="space-y-6">
          {analysisResult ? (
            <>
              <Card className="border-none">
                <CardContent className="space-y-4 pt-6">
                  {analysisResult.emotions.map((item) => (
                    <div key={item.text} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.emoji}</span>
                          <span>{item.text}</span>
                        </div>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-full rounded-full bg-[#4E80EE] transition-all duration-1000"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-none bg-[#F9FAFB]">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-medium">
                    {analysisResult.solution.title}
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {analysisResult.solution.description}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#4E80EE]" />
            </div>
          )}
          <div className="space-y-2">
            <Button
              className="w-full bg-[#4E80EE] py-6 text-lg hover:bg-[#4E80EE]/90"
              onClick={() => analyzeEmotion(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>분석중...</span>
                </div>
              ) : (
                "다른 솔루션 받기"
              )}
            </Button>
            <Link href="/chat" className="block w-full">
              <Button
                variant="ghost"
                className="w-full py-6 text-lg text-[#6B7280] underline hover:text-[#4B5563]"
              >
                Chill하게 대화하기
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (currentStep === 2) {
      await analyzeEmotion();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      router.push("/");
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>분석중...</span>
        </div>
      );
    }
    return currentStep === 2 ? "솔루션 받기" : "다음";
  };

  return (
    <div className="flex h-full flex-col bg-white p-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          className="h-9 w-9 hover:bg-transparent"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1">
        <h1 className="mb-8 whitespace-pre-line text-center text-2xl font-bold">
          {steps[currentStep].title}
        </h1>
        {steps[currentStep].component}
      </div>

      {currentStep < steps.length - 1 && (
        <div className="mt-auto">
          <div className="mb-4 flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-[#4E80EE]" : "bg-[#4E80EE]/20"
                }`}
              />
            ))}
          </div>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full bg-[#4E80EE] py-6 text-lg hover:bg-[#4E80EE]/90 disabled:opacity-50"
          >
            {getButtonText()}
          </Button>
        </div>
      )}
    </div>
  );
}
