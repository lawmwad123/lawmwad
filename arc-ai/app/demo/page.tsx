"use client";

import { Suspense } from "react";
import { OnboardingHub } from "@/components/onboarding/onboarding-hub";

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <OnboardingHub />
    </Suspense>
  );
}
