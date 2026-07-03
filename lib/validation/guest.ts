import { z } from "zod";

// Empty-string → undefined so optional email/phone from a form don't fail .email().
const optionalStr = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const guestCreateSchema = z.object({
  name: z.string().trim().min(1, "Нэр заавал").max(100),
  email: z
    .string()
    .email("И-мэйл буруу")
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: optionalStr(40),
  notes: optionalStr(500),
});

export const guestUpdateSchema = guestCreateSchema.partial();

export const guestImportSchema = z.object({
  rows: z.array(guestCreateSchema).min(1).max(500),
});

// Send: absent guestId = batch send to all un-sent guests.
export const sendSchema = z.object({
  guestId: z.string().uuid().optional(),
});

export type GuestCreateInput = z.infer<typeof guestCreateSchema>;
export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>;
