import { OnboardingForm } from "@/components/forms/OnboardingForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register your startup</h1>
          <p className="text-gray-500 mt-2">
            Get discovered by 1,000+ EU investors. Takes under 5 minutes.
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
