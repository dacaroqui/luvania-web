import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { site } from "@/data/site";
import type { Metadata } from "next";
import { Bodoni_Moda, Nunito_Sans } from "next/font/google";
import "./globals.css";

const sans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Clínica estética en Bogotá | Luvania",
    template: "%s",
  },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${sans.variable} ${display.variable}`}>
      <body className="pb-24 md:pb-0">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          Saltar al contenido
        </a>
        <Providers>
          <SiteHeader />
          <div id="contenido">{children}</div>
          <SiteFooter />
          <StickyCta />
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}
