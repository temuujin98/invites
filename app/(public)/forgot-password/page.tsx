"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  function validateEmail(v: string): string | undefined {
    if (!v) return "И-мэйл хаяг оруулна уу";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "И-мэйл хаяг буруу байна";
    return undefined;
  }

  function handleBlur() {
    setTouched(true);
    setEmailError(validateEmail(email));
  }

  function handleChange(v: string) {
    setEmail(v);
    if (touched) setEmailError(validateEmail(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-success-soft)">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="9" stroke="var(--color-success)" strokeWidth="1.8" />
              <path d="M7 11l3 3 5-5" stroke="var(--color-success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-(--color-text)">И-мэйл илгээлээ</h2>
            <p className="mt-1.5 text-xs text-(--color-text-secondary) max-w-xs leading-relaxed">
              <strong>{email}</strong> хаяг руу нууц үг сэргээх холбоос илгээлээ.
              И-мэйл ирэхгүй бол spam хавтас шалгаарай.
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-(--color-accent) hover:text-(--color-accent-hover) transition-colors"
          >
            ← Нэвтрэх хуудас руу буцах
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-bold text-(--color-text)">Нууц үг сэргээх</h1>
          <p className="mt-1 text-xs text-(--color-text-muted) leading-relaxed">
            Бүртгэлтэй и-мэйл хаягаа оруулна уу. Нууц үг сэргээх холбоос илгээнэ.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="И-мэйл хаяг"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            error={touched ? emailError : undefined}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-1"
            loading={loading}
          >
            Холбоос илгээх
          </Button>
        </form>

        <p className="text-center text-xs text-(--color-text-muted)">
          <Link
            href="/login"
            className="font-medium text-(--color-accent) hover:text-(--color-accent-hover) transition-colors"
          >
            ← Нэвтрэх хуудас руу буцах
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
