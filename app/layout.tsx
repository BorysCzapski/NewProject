// ============================================================================
// app/layout.tsx
// Root layout: fonts (with Polish "latin-ext" glyphs), global theme
// (light/dark) bootstrap script to avoid a flash of the wrong theme, and the
// ThemeProvider context used by the profile page's theme toggle.
// ============================================================================
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "EnglishApp — Nauka angielskiego",
  description: "Ucz się angielskiego codziennie: słówka, gramatyka, czytanie, pisanie, piosenki i słuchanie — dopasowane do Twojego poziomu.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EnglishApp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f16" },
  ],
};

// Runs before hydration so the correct theme class is present on first
// paint — avoids a light->dark (or vice versa) flash for returning users.
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
