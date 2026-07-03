"use client";

import { useState } from "react";
import type { Guest } from "@/types/guest";
import { guestCreateSchema } from "@/lib/validation/guest";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface GuestFormValues {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface GuestFormDrawerProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Guest>;
  onSubmit: (values: { name: string; email?: string; phone?: string; notes?: string }) => Promise<void>;
  submitting: boolean;
}

export function GuestFormDrawer({
  open,
  onClose,
  initial,
  onSubmit,
  submitting,
}: GuestFormDrawerProps) {
  const [values, setValues] = useState<GuestFormValues>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    notes: initial?.notes ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestFormValues, string>>>({});

  // Reset form when drawer opens with new initial values
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setValues({
        name: initial?.name ?? "",
        email: initial?.email ?? "",
        phone: initial?.phone ?? "",
        notes: initial?.notes ?? "",
      });
      setErrors({});
    }
  }

  function set(field: keyof GuestFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = guestCreateSchema.safeParse({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      notes: values.notes || undefined,
    });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof GuestFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof GuestFormValues;
        if (field) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    await onSubmit(result.data);
  }

  const isEdit = !!initial?.id;

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? "Зочин засах" : "Зочин нэмэх"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Нэр *"
          placeholder="Овог нэр"
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoFocus
          maxLength={100}
        />
        <Input
          label="И-мэйл"
          type="email"
          placeholder="example@mail.com"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          maxLength={200}
        />
        <Input
          label="Утасны дугаар"
          type="tel"
          placeholder="+976 9900 0000"
          value={values.phone}
          onChange={set("phone")}
          error={errors.phone}
          maxLength={40}
        />
        <Textarea
          label="Тэмдэглэл"
          placeholder="Нэмэлт мэдээлэл..."
          value={values.notes}
          onChange={set("notes")}
          error={errors.notes}
          rows={3}
          maxLength={500}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Цуцлах
          </Button>
          <Button type="submit" variant="primary" size="md" loading={submitting}>
            {isEdit ? "Хадгалах" : "Нэмэх"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
