import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB — too small for a Matma admin PDF upload (see
      // lib/matma/import-pdf.ts), scanned/multi-page arkusze routinely
      // exceed that.
      bodySizeLimit: "20mb",
    },
  },
  // The language app used to live at the root; since the Phoenix shell took
  // over "/" it moved under /jezyki. Keep old bookmarks and in-flight links
  // working forever.
  async redirects() {
    return [
      { source: "/nauka", destination: "/jezyki/nauka", permanent: true },
      { source: "/nauka/:path*", destination: "/jezyki/nauka/:path*", permanent: true },
      { source: "/prace-domowe", destination: "/jezyki/prace-domowe", permanent: true },
      { source: "/prace-domowe/:path*", destination: "/jezyki/prace-domowe/:path*", permanent: true },
      { source: "/kalendarz", destination: "/jezyki/kalendarz", permanent: true },
      { source: "/admin", destination: "/jezyki/admin", permanent: true },
      { source: "/admin/:path*", destination: "/jezyki/admin/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
