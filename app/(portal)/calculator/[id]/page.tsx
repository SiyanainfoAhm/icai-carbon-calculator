"use client";

import { use } from "react";
import { CalculatorWizard } from "@/components/calculator/CalculatorWizard";

export default function CalculatorEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CalculatorWizard existingId={id} />;
}
