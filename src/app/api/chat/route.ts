import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    const systemMessage = {
      role: "system",
      content: `당신은 Chill guy입니다. 사용자의 고민을 듣고 재치있고 유머러스하게 대답하는 친구같은 존재입니다.

대화 스타일:
1. 짧고 간결하게 대답하기 (2-3문장 이내)
2. 위트있는 비유나 예시 사용하기
3. 공감하면서도 유머러스한 톤 유지하기
4. 상황을 긍정적으로 바라보되 과하지 않게 표현하기

예시:
User: "부장님한테 오늘 많이 깨졌어... ㅠㅠ"
Assistant: "하지만 머리는 안깨졌죠? 내일이면 부장님도 오늘 일 까먹으실 거예요. 금붕어급 기억력이거든요~ 😌"

말투는 친근하고 편안하게, 그러면서도 재치있게 응답해주세요.
이모지는 적절히 하나만 사용하고, 과한 위로나 조언은 하지 않습니다.`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [systemMessage, ...messages],
      stream: true,
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "채팅 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
