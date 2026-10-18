"use client";

// ============================================================================
// components/informatyka/code-editor.tsx
// CodeMirror 6 editor (Python or SQL) styled with the app's theme tokens.
// Uncontrolled after mount: `value` seeds the document, `onChange` reports edits.
// ============================================================================
import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { basicSetup, EditorView } from "codemirror";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";

const theme = EditorView.theme({
  "&": { backgroundColor: "var(--surface)", color: "var(--foreground)", fontSize: "13px", borderRadius: "var(--radius-control)" },
  ".cm-content": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", caretColor: "var(--foreground)" },
  ".cm-gutters": { backgroundColor: "var(--surface-muted)", color: "var(--foreground-muted)", border: "none" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "transparent" },
  "&.cm-focused": { outline: "2px solid var(--primary)" },
  ".cm-scroller": { overflow: "auto" },
});

export interface CodeEditorHandle {
  /** Replaces the whole document (also reports it through onChange). */
  replace: (text: string) => void;
}

export function CodeEditor({
  value,
  onChange,
  onRun,
  language,
  minHeight = "14rem",
  handle,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl/Cmd+Enter. */
  onRun?: () => void;
  language: "python" | "sql";
  minHeight?: string;
  handle?: Ref<CodeEditorHandle>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  useImperativeHandle(handle, () => ({
    replace(text: string) {
      const view = viewRef.current;
      if (view) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
    },
  }));
  const callbacks = useRef({ onChange, onRun });
  useEffect(() => {
    callbacks.current = { onChange, onRun };
  });

  useEffect(() => {
    if (!host.current) return;
    const view = new EditorView({
      parent: host.current,
      doc: value,
      extensions: [
        basicSetup,
        // above basicSetup's own keymap, where Mod-Enter inserts a blank line
        Prec.highest(
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                callbacks.current.onRun?.();
                return true;
              },
            },
          ])
        ),
        keymap.of([indentWithTab]),
        language === "python" ? python() : sql(),
        theme,
        EditorView.contentAttributes.of({ spellcheck: "false", autocapitalize: "off", autocorrect: "off" }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) callbacks.current.onChange(u.state.doc.toString());
        }),
      ],
    });
    viewRef.current = view;
    return () => {
      viewRef.current = null;
      view.destroy();
    };
    // the document is seeded once; later edits flow out through onChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div
      ref={host}
      className="overflow-hidden rounded-(--radius-control) border border-border shadow-(--shadow-control) [&_.cm-editor]:min-h-(--editor-min-h)"
      style={{ "--editor-min-h": minHeight } as React.CSSProperties}
    />
  );
}
