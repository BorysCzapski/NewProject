// ============================================================================
// app/(main)/jezyki/nauka/pisownia/page.tsx
// Dawny hub „Pisownia". Wybór materiału i trybu jest teraz w jednym menu
// (app/(main)/jezyki/fiszki); ten adres zostaje, żeby stare zakładki i linki
// nie kończyły się błędem 404. Same sesje (…/sesja/[deckSlug]) działają dalej.
// ============================================================================
import { redirect } from "next/navigation";

export default function PisowniaRedirect() {
  redirect("/jezyki/fiszki");
}
