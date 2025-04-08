// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  id: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { id, password } = watch();
  const isFormEmpty = !id && !password;

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        id: data.id,
        password: data.password,
        redirect: false,
      });
      if (!result?.error) {
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white px-6 py-16">
      <div>
        <h1 className="text-xl">
          <span className="text-[#4E80EE]">Daily Chill</span>을 이용하고 싶다면?
        </h1>
        <h2 className="mt-1 text-2xl font-bold">로그인 하기</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-12 flex flex-1 flex-col"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm">아이디</label>
            <Input
              {...register("id")}
              className="mt-2 h-14 rounded-2xl bg-white"
              placeholder="hong123"
            />
            {errors.id && (
              <p className="mt-1 text-sm text-red-500">{errors.id.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm">비밀번호</label>
            <Input
              type="password"
              {...register("password")}
              className="mt-2 h-14 rounded-2xl bg-white"
              placeholder="password1234@!"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            type="submit"
            disabled={loading}
            className={`h-14 w-full rounded-2xl text-lg ${
              isFormEmpty || loading
                ? "bg-[#E2E2E2] text-black"
                : "bg-[#4E80EE] text-white hover:bg-[#3D6FDD]"
            }`}
          >
            로그인
          </Button>

          <div className="mt-3 text-center text-sm text-[#666]">
            아직 계정이 없다면?{" "}
            <Link href="/signup" className="font-medium text-black underline">
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
