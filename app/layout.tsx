import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/ui/CookieBanner";

export const metadata: Metadata = {
  title: "InvestTable — Discover EU Startups",
  description: "The premier discovery platform for EU startup investments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
        <CookieBanner />
      </body>
    </html>
  );
}
