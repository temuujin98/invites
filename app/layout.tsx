import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { logEnvOnce } from "@/lib/supabase/check-env";

logEnvOnce();

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invites — Монгол дижитал урилга",
  description: "Монгол хэл дээрх дижитал урилга үүсгэх платформ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="h-full">
      <body className={`${roboto.variable} antialiased min-h-full`}>
        {children}
      </body>
    </html>
  );
}
