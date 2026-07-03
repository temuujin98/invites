export const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "register",
  "dashboard",
  "templates",
  "create",
  "i",
  "g",
  "dev",
  "auth",
  "forgot-password",
  "update-password",
  "terms",
  "privacy",
] as const;

export const CANVAS_DEFAULT_W = 1080;
export const CANVAS_DEFAULT_H = 1920;

export const RSVP_STATUS = {
  YES: "attending",
  NO: "declined",
  MAYBE: "maybe",
} as const;

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://invites.mn";
