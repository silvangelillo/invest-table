"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("investtable-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("investtable-cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("investtable-cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[9999]">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">We use cookies</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              We use strictly necessary cookies for authentication and optional cookies to save your preferences.
              No tracking or advertising cookies.{" "}
              <Link href="/cookie-policy" className="text-blue-600 hover:underline">Learn more</Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={decline}
            className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Decline optional
          </button>
          <button
            onClick={accept}
            className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
