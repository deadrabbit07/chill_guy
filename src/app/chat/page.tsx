"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_BACKGROUNDS = [
  {
    id: 1,
    image: "/chat-background-1.png",
    chillGuy: {
      width: 280,
      height: 180,
      isFlipped: false,
      position: { right: "10%", bottom: "15%" },
    },
  },
  {
    id: 2,
    image: "/chat-background-2.png",
    chillGuy: {
      width: 240,
      height: 240,
      isFlipped: true,
      position: { right: "35%", bottom: "20%" },
    },
  },
  {
    id: 3,
    image: "/chat-background-3.png",
    chillGuy: {
      width: 200,
      height: 200,
      isFlipped: false,
      position: { left: "50%", top: "50%" },
    },
  },
  {
    id: 4,
    image: "/chat-background-4.png",
    chillGuy: {
      width: 200,
      height: 200,
      isFlipped: true,
      position: { left: "10%", top: "40%" },
    },
  },
] as const;

export default function Chat() {
  const [currentBg, setCurrentBg] = useState(0);
  const [message, setMessage] = useState("");
  const [chatting, setChatting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [response, setResponse] = useState("");
  const abortController = useRef<AbortController | null>(null);
  const router = useRouter();

  const changeBg = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentBg((prev) =>
        prev === 0 ? CHAT_BACKGROUNDS.length - 1 : prev - 1
      );
    } else {
      setCurrentBg((prev) =>
        prev === CHAT_BACKGROUNDS.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || chatting) return;

    setChatting(true);
    setResponse("");

    // Add user message to history
    const newUserMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      abortController.current = new AbortController();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
        }),
        signal: abortController.current.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullResponse += text;
        setResponse(fullResponse);
      }

      // Add assistant's response to history
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (error: any) {
      if (error.name === "AbortError") {
        setResponse("");
      } else {
        console.error("Chat error:", error);
      }
    } finally {
      setChatting(false);
      setMessage("");
    }
  };

  const handleCancel = () => {
    abortController.current?.abort();
    setChatting(false);
    setResponse("");
  };

  const currentBackground = CHAT_BACKGROUNDS[currentBg];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={currentBackground.image}
        alt="chat background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute left-0 right-0 top-0 flex h-14 items-center bg-white px-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-[#4E80EE]"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium">뒤로가기</span>
        </button>
      </div>

      <div className="absolute left-4 right-4 top-1/2 flex -translate-y-1/2 justify-between">
        <button
          onClick={() => changeBg("prev")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#4E80EE] shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => changeBg("next")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#4E80EE] shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* 중앙 고정 말풍선 */}
      {response && (
        <div className="absolute left-1/2 top-1/3 w-full max-w-[280px] -translate-x-1/2 -translate-y-1/2 px-4">
          <div className="relative rounded-2xl bg-white/95 p-5 shadow-lg">
            <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-gray-800">
              {response}
            </p>
            {/* 말풍선 꼬리 */}
            <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform bg-white/95"></div>
          </div>
        </div>
      )}

      <div
        className="absolute transition-all duration-300"
        style={currentBackground.chillGuy.position}
      >
        <div className="relative">
          <div
            className={`relative ${
              currentBackground.chillGuy.isFlipped ? "scale-x-[-1]" : ""
            }`}
          >
            <Image
              src="/chill-guy.png"
              alt="chill guy"
              width={currentBackground.chillGuy.width}
              height={currentBackground.chillGuy.height}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="absolute bottom-4 left-4 right-4"
      >
        <div className="flex items-center gap-2 rounded-full bg-white/95 p-2 shadow-lg">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Chill하게 대화하기"
            className="flex-1 border-none bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={chatting}
          />
          <button
            type={chatting ? "button" : "submit"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4E80EE] hover:bg-[#4E80EE]/10"
            onClick={chatting ? handleCancel : undefined}
          >
            {chatting ? (
              <X className="h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
