import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const siteUrl = "https://assentin.com.br";
const siteTitle = "Assentin | Consultoria financeira para pessoas e empresas";
const siteDescription =
  "Consultoria financeira pessoal e empresarial com planejamento, estratégia, acompanhamento e tecnologia para transformar objetivos em resultados.";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Assentin",
  },
  description: siteDescription,
  applicationName: "Assentin",
  keywords: [
    "consultoria financeira",
    "planejamento financeiro",
    "consultoria financeira pessoal",
    "consultoria financeira empresarial",
    "gestão financeira",
    "organização financeira",
  ],
  authors: [{ name: "Assentin Consultoria Financeira", url: siteUrl }],
  creator: "Assentin Consultoria Financeira",
  publisher: "Assentin Consultoria Financeira",
  category: "finance",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Assentin",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-assentin.jpg",
        width: 1200,
        height: 630,
        alt: "Assentin Consultoria Financeira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-assentin.jpg"],
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#071c30",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["Organization", "FinancialService"],
  name: "Assentin Consultoria Financeira",
  legalName: "Assentin Consultoria Financeira Ltda",
  taxID: "60.719.330/0001-63",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-transparent.png`,
  image: `${siteUrl}/og-assentin.jpg`,
  description: siteDescription,
  email: "contato@assentin.com.br",
  telephone: "+55-35-9904-5269",
  areaServed: "BR",
  sameAs: [
    "https://www.instagram.com/assentin.oficial/",
    "https://www.linkedin.com/company/assentin",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
