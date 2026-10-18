// Informatyka section layout: just mounts the floating exam countdown next to every page.
import { ExamBar } from "@/components/informatyka/exam-bar";

export default function InformatykaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ExamBar />
    </>
  );
}
