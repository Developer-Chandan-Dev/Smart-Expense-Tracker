import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Smart Expense Tracker - Intelligent Financial Management",
    template: "%s | Smart Expense Tracker"
  },
  description: "Take control of your finances with Smart Expense Tracker. Track expenses, manage budgets, and gain insights with real-time analytics. Free and budget tracking modes available.",
  keywords: ["expense tracker", "budget management", "financial planning", "money management", "expense analytics", "budget tracker", "personal finance"],
  authors: [{ name: "Smart Expense Tracker Team" }],
  creator: "Smart Expense Tracker",
  publisher: "Smart Expense Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-expense-tracker2.vercel.app'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Smart Expense Tracker - Intelligent Financial Management",
    description: "Take control of your finances with Smart Expense Tracker. Track expenses, manage budgets, and gain insights with real-time analytics.",
    siteName: "Smart Expense Tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Expense Tracker - Financial Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Expense Tracker - Intelligent Financial Management",
    description: "Take control of your finances with Smart Expense Tracker. Track expenses, manage budgets, and gain insights with real-time analytics.",
    images: ["/og-image.png"],
    creator: "@smartexpensetracker",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Smart Expense Tracker",
              "description": "Intelligent financial management platform for tracking expenses and managing budgets",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
