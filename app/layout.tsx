import type React from "react";
import { Inter } from "next/font/google";
import Script from "next/script"; // Import Next.js Script component
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const GA_TRACKING_ID = "G-2KE2SMM6T3"; // Replace with your actual GA4 tracking ID

export const metadata: Metadata = {
  title: {
    default: "Top Trending Blogs - Stay Updated with the Latest Trends",
    template: "%s | TrendyBlog",
  },
  description:
    "Discover trending topics and insightful articles on technology, business, lifestyle, and more.",
  keywords: ["blog", "trends", "articles", "news", "technology", "business"],
  authors: [{ name: "TrendyBlog Team" }],
  creator: "TrendyBlog",
  publisher: "TrendyBlog",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://trendyblog.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trendyblog.example.com",
    title: "TrendyBlog - Stay Updated with the Latest Trends",
    description:
      "Discover trending topics and insightful articles on technology, business, lifestyle, and more.",
    siteName: "TrendyBlog",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TrendyBlog - Stay Updated with the Latest Trends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendyBlog - Stay Updated with the Latest Trends",
    description:
      "Discover trending topics and insightful articles on technology, business, lifestyle, and more.",
    images: ["/twitter-image.jpg"],
    creator: "@trendyblog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6135540357167893"
     crossorigin="anonymous"></Script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
