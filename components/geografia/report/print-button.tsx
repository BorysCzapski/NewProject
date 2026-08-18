"use client";

// ============================================================================
// components/geografia/report/print-button.tsx
// Triggers the browser's native print dialog, which on every modern OS/
// browser offers "Save as PDF" — a lightweight, dependency-free way to
// deliver the product spec's "eksport wyników (PDF)" requirement without
// adding a PDF-generation library to the project.
// ============================================================================
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="print-hidden">
      <Printer className="h-4 w-4" />
      Zapisz jako PDF / wydrukuj
    </Button>
  );
}
