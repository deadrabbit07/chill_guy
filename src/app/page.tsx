"use client";

import Image from "next/image";
import { ChevronRight, Send, RefreshCcw, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DAILY_TIPS = [
  {
    id: 1,
    tip: "잠시 심호흡을 하고 창밖을 바라보세요. 작은 휴식이 큰 변화를 만들 수 있습니다.",
  },
  {
    id: 2,
    tip: "오늘 하루 가장 감사한 순간을 떠올려보세요. 작은 행복도 소중한 선물입니다.",
  },
  {
    id: 3,
    tip: "스트레스 받을 땐 좋아하는 음악을 들으며 잠시 산책해보세요. 기분 전환에 도움이 됩니다.",
  },
  {
    id: 4,
    tip: "하루에 한 번, 자신에게 '잘하고 있어'라고 말해주세요. 긍정적인 자기 대화는 힘이 됩니다.",
  },
  {
    id: 5,
    tip: "어깨와 목을 부드럽게 풀어주세요. 신체의 긴장을 풀면 마음의 긴장도 풀립니다.",
  },
  {
    id: 6,
    tip: "가끔은 아무것도 하지 않는 시간을 가져보세요. 그것도 중요한 휴식입니다.",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const [currentTip, setCurrentTip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
    return DAILY_TIPS[randomIndex];
  });

  const refreshTip = () => {
    let newTip = currentTip;
    while (newTip.id === currentTip.id) {
      const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
      newTip = DAILY_TIPS[randomIndex];
    }
    setCurrentTip(newTip);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between bg-white px-4 shadow-sm">
        <h1 className="text-2xl font-bold text-[#4E80EE]">Daily Chill</h1>
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="rounded-full p-2 hover:bg-gray-100">
                <User className="h-5 w-5 text-[#4E80EE]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <Link href="/calendar">
                <DropdownMenuItem className="cursor-pointer">
                  내 솔루션들
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="font-medium text-gray-600 hover:text-gray-900"
          >
            로그인
          </Link>
        )}
      </header>

      <main className="flex flex-grow flex-col items-center overflow-y-auto bg-[#F9FAFB] p-4">
        <Link href="/check" className="mt-4 w-full">
          <div className="flex items-center justify-between rounded-xl bg-[#4E80EE] p-7 shadow-sm transition-all hover:bg-[#4E80EE]/90">
            <span className="text-lg font-semibold text-white">
              스트레스 체크 😊
            </span>
            <ChevronRight className="text-white" />
          </div>
        </Link>

        <div className="mt-3 w-full rounded-xl border-2 bg-white p-4">
          <div className="flex justify-end">
            <button
              onClick={refreshTip}
              className="text-[#BEBDBD] hover:text-gray-600 transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mb-2 mt-4 text-lg font-semibold">오늘의 팁 💡</h2>
          <p className="mb-8 text-gray-700">{currentTip.tip}</p>
        </div>

        <Link
          href="/chat"
          className="flex min-h-screen w-full flex-col items-center"
        >
          <div className="relative top-4 z-10 mt-36 flex w-full justify-end">
            <div>
              <Image
                src="/message-circle.png"
                alt="message-circle"
                width={140}
                height={140}
              />
            </div>
            <div className="mr-10">
              <Image
                src="/chill-guy.png"
                alt="chill guy"
                width={140}
                height={140}
              />
            </div>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Chill하게 대화하기"
              className="w-full rounded-xl border-2 border-gray-300 p-4 pr-12"
            />
            <div className="absolute right-3 top-1/2 mr-2 -translate-y-1/2 cursor-pointer">
              <Send />
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
}
