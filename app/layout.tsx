import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import RootLayoutClient from './components/RootLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://plantsage.vercel.app'),
  title: 'Plant Sage - Free AI Plant Identification & Care Guide',
  description: 'Instantly identify any plant with our free AI-powered tool. Get detailed plant care guides, watering schedules, and expert gardening tips. Perfect for gardeners, plant enthusiasts, and nature lovers.',
  keywords: 'plant identification, AI plant identifier, plant care guide, garden helper, plant species detection, plant care tips, free plant identification, plant recognition app, plant database, gardening assistant',
  authors: [{ name: 'Plant Sage' }],
  creator: 'Plant Sage',
  publisher: 'Plant Sage',
  openGraph: {
    title: 'Plant Sage - Free AI Plant Identification & Care Guide',
    description: 'Instantly identify any plant with our free AI-powered tool. Get detailed plant care guides, watering schedules, and expert gardening tips.',
    url: 'https://plantsage.vercel.app',
    siteName: 'Plant Sage',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Plant Sage - AI Plant Identification',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plant Sage - Free AI Plant Identification & Care Guide',
    description: 'Instantly identify any plant with our free AI-powered tool. Get detailed plant care guides, watering schedules, and expert gardening tips.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-site-verification-here',
  },
  alternates: {
    canonical: 'https://plantsage.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Plant Sage",
              "description": "Free AI-powered plant identification and care guide tool",
              "url": "https://plantsage.vercel.app",
              "applicationCategory": "UtilityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Instant plant identification",
                "Detailed care guides",
                "Watering schedules",
                "Light requirements",
                "Temperature preferences",
                "Soil recommendations"
              ]
            }
          `}
        </Script>
      </head>
      <RootLayoutClient className={inter.className}>
        {children}
      </RootLayoutClient>
    </html>
  );
}
