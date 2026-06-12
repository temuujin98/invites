"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = "Нэр оруулна уу";
  } else if (values.name.trim().length < 2) {
    errors.name = "Нэр хамгийн багадаа 2 тэмдэгт байна";
  }
  if (!values.email) {
    errors.email = "И-мэйл хаяг оруулна уу";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "И-мэйл хаяг буруу байна";
  }
  if (!values.password) {
    errors.password = "Нууц үг оруулна уу";
  } else if (values.password.length < 8) {
    errors.password = "Нууц үг хамгийн багадаа 8 тэмдэгт байна";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Нууц үгээ давтан оруулна уу";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Нууц үг таарахгүй байна";
  }
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setErrors({});

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { display_name: values.name.trim() },
      },
    });

    setLoading(false);

    if (error) {
      setErrors({ general: error.message });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-bold text-(--color-text)">Бүртгэл үүсгэх</h1>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            Үнэгүй бүртгэл үүсгэж эхэл
          </p>
        </div>

        {errors.general && (
          <div className="rounded-(--radius-ctrl) bg-(--color-danger-soft) border border-danger/30 px-4 py-3">
            <p className="text-xs text-(--color-danger)">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Нэр"
            type="text"
            placeholder="Таны нэр"
            autoComplete="name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            error={touched.name ? errors.name : undefined}
          />
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
          <Input
            label="Нууц үг"
            type="password"
            placeholder="Хамгийн багадаа 8 тэмдэгт"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
          />
          <Input
            label="Нууц үг давтах"
            type="password"
            placeholder="Нууц үгээ давтан оруул"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          <Button
            type="submit"
            variant="accent"
            className="w-full mt-1"
            loading={loading}
          >
            Бүртгэл үүсгэх
          </Button>
        </form>

        <p className="text-center text-xs text-(--color-text-muted)">
          Бүртгэлтэй юу?{" "}
          <Link
            href="/login"
            className="font-medium text-(--color-accent) hover:text-(--color-accent-hover) transition-colors"
          >
            Нэвтрэх
          </Link>
        </p>

        <p className="text-center text-[11px] text-(--color-text-muted) leading-relaxed">
          Бүртгэл үүсгэснээр{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-(--color-text)">
            үйлчилгээний нөхцөл
          </Link>
          {" "}болон{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-(--color-text)">
            нууцлалын бодлого
          </Link>
          -д зөвшөөрч байна.
        </p>
      </div>
    </AuthLayout>
  );
}
