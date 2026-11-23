import { PageMotion } from "@/components/page-motion";
import { FlorBackdrop } from "@/components/flor-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { StickyCta } from "@/components/sticky-cta";
import { ToneField } from "@/components/tone-field";
import { resolveSedes } from "@/data/sedes";
import { site } from "@/data/site";
import type { Metadata } from "next";
import { Bodoni_Moda, Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  style: ["normal"],
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
        <FlorBackdrop />
        <ToneField />
        <PageMotion />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          Saltar al contenido
        </a>
        <Providers
          demoCart={process.env.VERCEL_ENV !== "production"}
          sedes={resolveSedes().map(({ slug, name, neighborhood, whatsapp }) => ({
            slug,
            name,
            neighborhood,
            whatsapp,
          }))}
        >
          <SiteHeader />
          <div id="contenido">{children}</div>
          <SiteFooter />
          <StickyCta />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
