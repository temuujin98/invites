"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.email) {
    errors.email = "И-мэйл хаяг оруулна уу";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "И-мэйл хаяг буруу байна";
  }
  if (!values.password) {
    errors.password = "Нууц үг оруулна уу";
  } else if (values.password.length < 6) {
    errors.password = "Нууц үг хамгийн багадаа 6 тэмдэгт байна";
  }
  return errors;
}

export default function LoginPage() {
  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(values);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errs = validate({ ...values, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Phase 7: real Supabase auth. Mock delay for now.
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setErrors({ general: "Нэвтрэх функц Phase 7-д нэмэгдэнэ." });
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-bold text-(--color-text)">Нэвтрэх</h1>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            Бүртгэлтэй хэрэглэгч нэвтэрнэ үү
          </p>
        </div>

        {errors.general && (
          <div className="rounded-(--radius-ctrl) bg-(--color-danger-soft) border border-(--color-danger)/30 px-4 py-3">
            <p className="text-xs text-(--color-danger)">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="И-мэйл хаяг"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            error={touched.email ? errors.email : undefined}
          />
          <div className="flex flex-col gap-1">
            <Input
              label="Нууц үг"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              error={touched.password ? errors.password : undefined}
            />
            <Link
              href="/forgot-password"
              className="self-end text-xs text-(--color-accent) hover:text-(--color-accent-hover) transition-colors"
            >
              Нууц үгээ мартсан?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-1"
            loading={loading}
          >
            Нэвтрэх
          </Button>
        </form>

        <p className="text-center text-xs text-(--color-text-muted)">
          Бүртгэлгүй юу?{" "}
          <Link
            href="/register"
            className="font-medium text-(--color-accent) hover:text-(--color-accent-hover) transition-colors"
          >
            Бүртгэл үүсгэх
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
