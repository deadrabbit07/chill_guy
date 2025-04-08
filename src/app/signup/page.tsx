"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z
  .object({
    id: z.string().min(1, "아이디를 입력해주세요"),
    password: z.string().min(1, "비밀번호를 입력해주세요"),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const { id, password, passwordConfirm } = watch();
  const isFormEmpty = !id && !password && !passwordConfirm;

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      // await fetch("/api/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white px-6 py-16">
      <div>
        <h1 className="text-xl">
          <span className="text-[#4E80EE]">Daily Chill</span> 계정이 없으신가요?
        </h1>
        <h2 className="mt-1 text-2xl font-bold">회원가입 하기</h2>
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

          <div>
            <label className="text-sm">비밀번호 확인</label>
            <Input
              type="password"
              {...register("passwordConfirm")}
              className="mt-2 h-14 rounded-2xl bg-white"
              placeholder="password1234@!"
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-500">
                {errors.passwordConfirm.message}
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
            회원가입
          </Button>

          <p className="mt-3 text-center text-sm text-[#666]">
            회원가입 시 <span className="text-[#4E80EE]">Daily Chill</span>에서
            이용하는 모든
            <br />
            개인정보 사용에 동의하게됩니다.
          </p>
        </div>
      </form>
    </div>
  );
}
