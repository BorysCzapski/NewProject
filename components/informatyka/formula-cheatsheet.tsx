import { FUNCTION_PAIRS } from "@/lib/informatyka/formula-translate";

export function FormulaCheatsheet() {
  return (
    <div className="flex flex-col gap-2 text-xs">
      <p className="text-foreground-muted">
        Formuły możesz wpisywać po polsku jak na egzaminie (np.{" "}
        <span className="font-mono">=SUMA.JEŻELI(A:A;&quot;x&quot;;B:B)</span>) — arkusz sam zamieni je na angielskie
        nazwy i przecinki (<span className="font-mono">=SUMIF(A:A,&quot;x&quot;,B:B)</span>). Poniżej odpowiedniki.
      </p>
      <div className="max-h-80 overflow-auto rounded-(--radius-control) border border-border">
        <table className="w-full border-collapse text-left font-mono">
          <thead className="sticky top-0 bg-surface-muted">
            <tr>
              <th className="px-2 py-1.5 font-semibold text-foreground">Egzamin (PL)</th>
              <th className="px-2 py-1.5 font-semibold text-foreground">W aplikacji (EN)</th>
            </tr>
          </thead>
          <tbody>
            {FUNCTION_PAIRS.map(([pl, en]) => (
              <tr key={pl} className="odd:bg-surface even:bg-surface-muted/40">
                <td className="px-2 py-1 text-foreground">{pl}</td>
                <td className="px-2 py-1 text-foreground">{en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
