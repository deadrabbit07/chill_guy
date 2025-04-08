import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

const emotions = {
  평온하다: { base_happy: 70, base_sad: 20, base_stress: 30 },
  피곤하다: { base_happy: 40, base_sad: 50, base_stress: 60 },
  불안하다: { base_happy: 30, base_sad: 60, base_stress: 80 },
  화나다: { base_happy: 20, base_sad: 70, base_stress: 85 },
  슬프다: { base_happy: 20, base_sad: 80, base_stress: 70 },
};

export async function POST(req: Request) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const { emotion, stressLevel, description } = await req.json();

    const baseEmotions = emotions[emotion as keyof typeof emotions];
    const stressAdjustment = (stressLevel - 50) / 50;

    const systemPrompt = `당신은 Chill guy입니다. 사용자의 감정을 이해하고 여유롭고 긍정적인 해결책을 제시합니다.

아래 JSON 형식으로 응답해 주세요:
{
  "emotions": [
    {
      "emoji": "이모지",
      "text": "감정 이름",
      "value": "수치(0-100)"
    }
  ],
  "solution": {
    "title": "해결책 제목",
    "description": "상세 해결책 설명"
  }
}

다음 기준으로 응답을 작성해주세요:
1. 감정별 기본 수치:
   - 행복: ${baseEmotions.base_happy + stressAdjustment * 10}
   - 슬픔: ${baseEmotions.base_sad + stressAdjustment * 10}
   - 스트레스: ${baseEmotions.base_stress + stressAdjustment * 10}

2. 해결책은 다음 요소를 포함해주세요:
   - Chill guy처럼 여유롭고 따뜻한 톤
   - 현실적이고 실천 가능한 제안
   - 긍정적인 관점에서의 재해석
   - 구체적인 행동 지침

사용자의 현재 감정("${emotion}")과 스트레스 수준(${stressLevel}), 그리고 설명("${description}")을 고려하여 
공감적이면서도 실용적인 솔루션을 제시해주세요.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || "");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "감정 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
