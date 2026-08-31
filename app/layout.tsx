import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Norgeworkis | Darbai Norvegijoje",
    template: "%s | Norgeworkis",
  },
  description:
    "Norgeworkis – darbo pasiūlymai Norvegijoje Lietuvos specialistams. Kandidatų registracija, darbo pasiūlymai ir aiški informacija apie darbą Norvegijoje.",
  keywords: [
    "Norgeworkis",
    "darbas Norvegijoje",
    "darbai Norvegijoje",
    "darbo pasiūlymai Norvegijoje",
    "darbas užsienyje",
    "darbas lietuviams Norvegijoje",
  ],
  applicationName: "Norgeworkis",
  authors: [{ name: "Norgeworkis" }],
  creator: "Norgeworkis",
  publisher: "Norgeworkis",
  metadataBase: new URL("https://www.norgeworkis.lt"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Norgeworkis | Darbai Norvegijoje",
    description: "Darbo pasiūlymai Norvegijoje Lietuvos specialistams.",
    url: "https://www.norgeworkis.lt",
    siteName: "Norgeworkis",
    locale: "lt_LT",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body>
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-62TVFP80X8"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-62TVFP80X8');
          `}
        </Script>
      </body>
    </html>
  );
}