export function authErrorMessage(
  error: { message?: string; code?: string } | null | undefined,
): string {
  if (!error) return "Алдаа гарлаа. Дахин оролдоно уу.";

  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();

  if (code === "invalid_credentials" || msg.includes("invalid login credentials")) {
    return "И-мэйл эсвэл нууц үг буруу байна.";
  }
  if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
    return "И-мэйл хаягаа баталгаажуулна уу.";
  }
  if (
    code === "user_already_exists" ||
    msg.includes("already registered") ||
    msg.includes("already been registered")
  ) {
    return "Энэ и-мэйл хаягаар аль хэдийн бүртгүүлсэн байна.";
  }
  if (code === "weak_password" || msg.includes("password should be")) {
    return "Нууц үг хэтэрхий сул байна. Илүү урт нууц үг сонгоно уу.";
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    msg.includes("rate limit")
  ) {
    return "Хэт олон удаа оролдлоо. Түр хүлээгээд дахин оролдоно уу.";
  }
  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return "Сүлжээний алдаа. Холболтоо шалгаад дахин оролдоно уу.";
  }
  return "Алдаа гарлаа. Дахин оролдоно уу.";
}
