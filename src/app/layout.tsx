import type { Metadata } from "next";
import { Martian_Mono, Wix_Madefor_Text, Cascadia_Mono, Parastoo } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-provider";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

// Their eleven-slide protocol is a fixed-pitch system: same positions, same
// order, every car. Martian Mono carries that as the display face — a
// monospace as the identity, not just the instrumentation.
const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-martian-mono",
});
const wixMadeforText = Wix_Madefor_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-wix-madefor",
});
// A monospace Arabic face, matching Martian Mono's fixed-pitch identity on
// the Latin side -- their eleven-position protocol is a grid system, and no
// prior site in this series pairs a mono display face on both scripts.
const cascadiaMono = Cascadia_Mono({
  subsets: ["arabic"],
  weight: ["600", "700"],
  variable: "--font-cascadia-mono",
});
const parastoo = Parastoo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-parastoo",
});

export const metadata: Metadata = {
  title: "Exotica Automotive — eleven positions, ten photographs | New Cairo",
  description:
    "A concept site built from Exotica Automotive's own showroom protocol: every car shot from the same eleven fixed positions, exterior in black and white, interior in colour, and their eleventh slide proven to be their first, republished.",
  metadataBase: new URL("https://exotica-automotive-site.vercel.app"),
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "Exotica Automotive — eleven positions, ten photographs",
    description:
      "Their own carousel, measured: five monochrome exterior slides, five in colour, and a closing frame proven identical to the first.",
    locale: "en_US",
    type: "website",
  },
  other: { "theme-color": "#bdbdbd" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // translate="no": the page ships hand-written AR/EN copy, and Chrome's
    // auto-translate rewrites `lang`, which would also break every
    // [dir="rtl"] correction if the CSS were keyed off language.
    <html
      lang="en"
      dir="ltr"
      translate="no"
      className={`notranslate ${martianMono.variable} ${wixMadeforText.variable} ${cascadiaMono.variable} ${parastoo.variable}`}
    >
      <body className="bg-ground text-ink antialiased">
        {/* The Advance reveals children in a stepped, zero-interpolation
            sequence gated on an IntersectionObserver. Without scripting every
            block would stay at opacity 0 forever. */}
        <noscript>
          <style>{`[data-advance-item]{opacity:1!important}`}</style>
        </noscript>
        <LocaleProvider dictionaries={{ ar, en }} defaultLocale="en">
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
