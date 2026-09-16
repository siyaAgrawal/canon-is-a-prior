import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://canon-is-a-prior.local"),
  title: {
    default: "The Canon Is a Prior",
    template: "%s — The Canon Is a Prior",
  },
  description:
    "Change one assumption and the person changes, though nothing they did has. An investigation into how we build the versions of reality we then call reality — and into whether the pattern it keeps finding is really there.",
  openGraph: {
    title: "The Canon Is a Prior",
    description:
      "Same evidence. Change one assumption. Different person. An investigation that keeps finding the same shape, and is not yet sure the shape is there.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F4ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Loaded via link rather than next/font so the site builds and runs offline,
            falling back to the stacks declared in tailwind.config.ts. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=Caveat:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:font-mono focus:text-xs"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
