// ============================================================================
// lib/types/pdf-parse.d.ts
// Minimal ambient module declaration for "pdf-parse" (v1.1.1 pinned — the
// classic lightweight pure-JS build, no native deps). The package ships no
// types of its own; this covers the exact call shape used in
// lib/matma/import-past-exams.ts (see node_modules/pdf-parse/lib/pdf-parse.js
// for the real return shape this mirrors).
//
// Declared against the "pdf-parse/lib/pdf-parse.js" SUBPATH, not the package
// root: the root index.js has a `let isDebugMode = !module.parent` check
// that (mis)fires true under bundlers (Turbopack/webpack don't set
// module.parent), which makes it eagerly read a bundled sample PDF at
// import time and throws (ENOENT) during `next build`'s page-data
// collection. The subpath is the real parser with none of that wrapper.
// ============================================================================
declare module "pdf-parse/lib/pdf-parse.js" {
  interface PdfParseResult {
    numpages: number;
    numrender: number;
    info: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string | null;
  }

  interface PdfParseOptions {
    max?: number;
    version?: string;
    pagerender?: (pageData: unknown) => Promise<string>;
  }

  function pdfParse(dataBuffer: Buffer, options?: PdfParseOptions): Promise<PdfParseResult>;
  export = pdfParse;
}
