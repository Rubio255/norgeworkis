import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.norgeworkis.lt"),

  title: {
    default: "Norgeworkis | Darbai Norvegijoje",
    template: "%s | Norgeworkis",
  },

  description:
    "Norgeworkis – darbo pasiūlymai Norvegijoje Lietuvos specialistams. Statybų ir kitų sričių darbai, kandidatų registracija ir informacija apie darbą Norvegijoje.",

  keywords: [
    "Norgeworkis",
    "darbas Norvegijoje",
    "darbai Norvegijoje",
    "darbo pasiūlymai Norvegijoje",
    "darbas Norvegijoje lietuviams",
    "statybų darbai Norvegijoje",
    "darbas Osle",
    "darbas užsienyje",
  ],

  applicationName: "Norgeworkis",

  authors: [
    {
      name: "Norgeworkis",
      url: "https://www.norgeworkis.lt",
    },
  ],

  creator: "Norgeworkis",
  publisher: "Norgeworkis",

  alternates: {
    canonical: "/",
    languages: {
      "lt-LT": "/",
    },
  },

  openGraph: {
    title: "Norgeworkis | Darbai Norvegijoje",

    description:
      "Darbo pasiūlymai Norvegijoje Lietuvos specialistams.",

    url: "https://www.norgeworkis.lt",

    siteName: "Norgeworkis",

    locale: "lt_LT",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Norgeworkis | Darbai Norvegijoje",

    description:
      "Darbo pasiūlymai Norvegijoje Lietuvos specialistams.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "jobs",
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

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-62TVFP80X8');
          `}
        </Script>
      </body>
    </html>
  );
}