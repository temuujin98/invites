"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [apiError, setApiError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);

  function validate(pw: string, cf: string): string | undefined {
    if (pw.length < 8) return "Нууц үг дор хаяж 8 тэмдэгт байх ёстой";
    if (pw !== cf) return "Нууц үг таарахгүй байна";
    return undefined;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setApiError(undefined);
    const err = validate(password, confirm);
    setError(err);
    if (err) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) {
        setApiError(
          "Нууц үг шинэчлэхэд алдаа гарлаа. Холбоос хугацаа дууссан байж магадгүй.",
        );
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setApiError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
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
            <h2 className="text-base font-bold text-(--color-text)">Нууц үг шинэчлэгдлээ</h2>
            <p className="mt-1.5 text-xs text-(--color-text-secondary)">
              Таныг хяналтын самбар руу шилжүүлж байна…
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-bold text-(--color-text)">Шинэ нууц үг</h1>
          <p className="mt-1 text-xs text-(--color-text-muted) leading-relaxed">
            Шинэ нууц үгээ оруулна уу.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Шинэ нууц үг"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched) setError(validate(e.target.value, confirm));
            }}
            error={touched ? error : undefined}
          />
          <Input
            label="Нууц үг давтах"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (touched) setError(validate(password, e.target.value));
            }}
          />
          {apiError && <p className="text-xs text-(--color-danger)">{apiError}</p>}
          <Button type="submit" variant="primary" className="w-full mt-1" loading={loading}>
            Нууц үг шинэчлэх
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
