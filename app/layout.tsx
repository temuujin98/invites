import type { Metadata } from "next";
import { Roboto, Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { logEnvOnce } from "@/lib/supabase/check-env";

logEnvOnce();

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// Invitation heading/body fonts offered by the theme picker. Loaded here so
// section headings render in the chosen family instead of a serif fallback.
// (Cyrillic subset where the family supports it; Playfair/Cormorant are latin —
// Mongolian headings in those fall back to Roboto via the var chain.)
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invites — Монгол дижитал урилга",
  description: "Монгол хэл дээрх дижитал урилга үүсгэх платформ",
  openGraph: {
    images: [{ url: "/logo-white.png", width: 1200, height: 630, alt: "invites.mn" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="h-full">
      <body
        className={`${roboto.variable} ${playfair.variable} ${cormorant.variable} ${montserrat.variable} antialiased min-h-full`}
      >
        {children}
      </body>
    </html>
  );
}
