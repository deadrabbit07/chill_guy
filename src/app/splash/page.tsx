"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      router.push("/");
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-[#4E80EE] flex justify-center items-center flex-col gap-8">
      <Image
        src="/logo.png"
        alt="logo"
        width={200}
        height={200}
        className="object-cover"
      />
      <p className="text-white font-bold text-2xl">Daily Chill</p>
    </div>
  );
}
