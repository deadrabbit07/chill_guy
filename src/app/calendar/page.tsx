"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);
dayjs.locale("ko");

interface EmotionRecord {
  id: string;
  date: Date;
  createdAt: Date;
  emotions: {
    emoji: string;
    text: string;
    value: number;
  }[];
  solution: {
    title: string;
    description: string;
  };
}

const mockRecords: EmotionRecord[] = [
  {
    id: "1",
    date: new Date(2025, 1, 9),
    createdAt: new Date(2025, 1, 9, 9, 30),
    emotions: [
      { emoji: "😌", text: "행복", value: 30 },
      { emoji: "😢", text: "슬픔", value: 65 },
      { emoji: "😰", text: "스트레스", value: 75 },
    ],
    solution: {
      title: "아침의 마음",
      description: "상쾌한 아침이에요. 오늘 하루도 화이팅!",
    },
  },
  {
    id: "2",
    date: new Date(2025, 1, 9),
    createdAt: new Date(2025, 1, 9, 18, 45),
    emotions: [
      { emoji: "😌", text: "행복", value: 45 },
      { emoji: "😢", text: "슬픔", value: 40 },
      { emoji: "😰", text: "스트레스", value: 50 },
    ],
    solution: {
      title: "저녁의 마음",
      description: "하루를 마무리하며 차분히 돌아보는 시간을 가져보세요.",
    },
  },
  {
    id: "3",
    date: new Date(2025, 1, 7),
    createdAt: new Date(2025, 1, 7, 14, 20),
    emotions: [
      { emoji: "😌", text: "행복", value: 45 },
      { emoji: "😢", text: "슬픔", value: 30 },
      { emoji: "😰", text: "스트레스", value: 90 },
    ],
    solution: {
      title: "오후의 휴식",
      description: "잠시 휴식을 취하며 마음을 달래보세요.",
    },
  },
  {
    id: "4",
    date: new Date(2025, 1, 5),
    createdAt: new Date(2025, 1, 5, 20, 15),
    emotions: [
      { emoji: "😌", text: "행복", value: 20 },
      { emoji: "😢", text: "슬픔", value: 85 },
      { emoji: "😰", text: "스트레스", value: 70 },
    ],
    solution: {
      title: "하루를 마무리하며",
      description: "힘든 하루였지만, 내일은 더 나은 날이 될 거예요.",
    },
  },
  {
    id: "5",
    date: new Date(2025, 1, 2),
    createdAt: new Date(2025, 1, 2, 12, 30),
    emotions: [
      { emoji: "😌", text: "행복", value: 75 },
      { emoji: "😢", text: "슬픔", value: 15 },
      { emoji: "😰", text: "스트레스", value: 20 },
    ],
    solution: {
      title: "즐거운 점심시간",
      description: "맛있는 점심과 함께하는 평화로운 시간이네요.",
    },
  },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const router = useRouter();

  const generateCalendar = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const calendar = [];
    let day = startDate;

    while (day.isSameOrBefore(endDate)) {
      calendar.push(day);
      day = day.add(1, "day");
    }

    return calendar;
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const days = generateCalendar();

  const hasRecord = (date: dayjs.Dayjs) => {
    return mockRecords.some(
      (record) =>
        dayjs(record.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  const getSelectedRecords = () => {
    return mockRecords
      .filter(
        (record) =>
          dayjs(record.date).format("YYYY-MM-DD") ===
          selectedDate.format("YYYY-MM-DD")
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white p-4">
      <Button
        variant="ghost"
        size="icon"
        className="mb-4 w-fit"
        onClick={() => router.push("/")}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div className="relative mb-8 text-center">
        <h2 className="text-2xl font-bold">{currentDate.format("M월")}</h2>
        <span className="text-lg text-gray-500">
          {currentDate.format("YYYY")}
        </span>
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isCurrentMonth = day.month() === currentDate.month();
          const hasEmotionRecord = hasRecord(day);
          const isSelected =
            day.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`relative h-10 rounded-full text-sm
               ${!isCurrentMonth ? "text-gray-300" : ""}
               ${isSelected ? "bg-[#4E80EE] text-white" : ""}
             `}
            >
              {day.format("D")}
              {hasEmotionRecord && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#4E80EE]" />
              )}
            </button>
          );
        })}
      </div>

      {getSelectedRecords().length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold">
            {selectedDate.format("M월 D일")}의 기록
          </h3>
          {getSelectedRecords().map((record) => (
            <div
              key={record.id}
              className="rounded-2xl bg-white p-4 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{dayjs(record.createdAt).format("A HH:mm")}</span>
              </div>
              {record.emotions.map((emotion) => (
                <div key={emotion.text} className="mb-3 last:mb-0">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{emotion.emoji}</span>
                      <span>{emotion.text}</span>
                    </div>
                    <span>{emotion.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div
                      className="h-full rounded-full bg-[#4E80EE] transition-all duration-300"
                      style={{ width: `${emotion.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-1">{record.solution.title}</h4>
                <p className="text-sm text-gray-600">
                  {record.solution.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
