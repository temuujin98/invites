"use client";

import { useMemo } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, DateInput, TimeInput } from "@/components/ui";
import { ImageCropUpload } from "@/components/shared";
import type { TemplateFieldConfig, InviteValues } from "@/types/template";

interface GeneratedInviteFormProps {
  fields: TemplateFieldConfig[];
  values: InviteValues;
  onChange: (values: InviteValues) => void;
}

const SKIP_TYPES = new Set(["qr", "rsvp"]);

export function GeneratedInviteForm({ fields, values, onChange }: GeneratedInviteFormProps) {
  const formFields = useMemo(
    () =>
      [...fields]
        .filter((f) => !SKIP_TYPES.has(f.type))
        .sort((a, b) => a.layerOrder - b.layerOrder),
    [fields],
  );

  const schema = useMemo(() => {
    const shape = formFields.reduce<Record<string, z.ZodTypeAny>>((acc, field) => {
      if (field.type === "image") {
        const base = z.string();
        acc[field.key] = field.required ? base.min(1, "Заавал бөглөнө") : base.optional();
      } else {
        const base = z.string();
        acc[field.key] = field.required ? base.min(1, "Заавал бөглөнө") : base.optional();
      }
      return acc;
    }, {});
    return z.object(shape);
  }, [formFields]);

  type FormValues = z.infer<typeof schema>;

  // Build default values from InviteValues
  const defaultValues = useMemo(() => {
    return formFields.reduce<Record<string, string>>((acc, field) => {
      if (field.type === "image") {
        acc[field.key] = values[field.key]?.assetUrl ?? "";
      } else {
        acc[field.key] = values[field.key]?.text ?? "";
      }
      return acc;
    }, {});
  }, [formFields, values]);

  const { control, trigger } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  function handleChange(key: string, patch: InviteValues[string]) {
    const next: InviteValues = { ...values, [key]: { ...values[key], ...patch } };
    onChange(next);
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        trigger();
      }}
      noValidate
    >
      {formFields.map((field) => {
        if (field.type === "image") {
          return (
            <ImageCropUpload
              key={field.id}
              label={field.label}
              value={values[field.key]?.assetUrl}
              onImage={(url) => handleChange(field.key, { assetUrl: url })}
            />
          );
        }

        if (field.type === "date") {
          return (
            <Controller
              key={field.id}
              name={field.key as keyof FormValues}
              control={control}
              render={({ field: f, fieldState }) => (
                <DateInput
                  label={field.label}
                  placeholder={field.placeholder}
                  value={(f.value as string) ?? ""}
                  onChange={(v) => {
                    f.onChange(v);
                    handleChange(field.key, { text: v });
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          );
        }

        if (field.type === "time") {
          return (
            <Controller
              key={field.id}
              name={field.key as keyof FormValues}
              control={control}
              render={({ field: f, fieldState }) => (
                <TimeInput
                  label={field.label}
                  placeholder={field.placeholder}
                  value={(f.value as string) ?? ""}
                  onChange={(v) => {
                    f.onChange(v);
                    handleChange(field.key, { text: v });
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          );
        }

        if (field.type === "location") {
          return (
            <Controller
              key={field.id}
              name={field.key as keyof FormValues}
              control={control}
              render={({ field: f, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Input
                    label={field.label}
                    placeholder={field.placeholder}
                    value={(f.value as string) ?? ""}
                    onChange={(e) => {
                      f.onChange(e);
                      handleChange(field.key, { text: e.target.value });
                    }}
                    error={fieldState.error?.message}
                  />
                  <p className="text-xs text-(--color-text-muted) flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <circle cx="6" cy="4.5" r="1" fill="currentColor" />
                    </svg>
                    Байршлын нэр оруулна уу
                  </p>
                </div>
              )}
            />
          );
        }

        // text / custom
        return (
          <Controller
            key={field.id}
            name={field.key as keyof FormValues}
            control={control}
            render={({ field: f, fieldState }) => (
              <Input
                label={field.label}
                placeholder={field.placeholder}
                value={(f.value as string) ?? ""}
                onChange={(e) => {
                  f.onChange(e);
                  handleChange(field.key, { text: e.target.value });
                }}
                error={fieldState.error?.message}
              />
            )}
          />
        );
      })}
    </form>
  );
}
