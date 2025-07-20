import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

// Font configuration with optimization
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vibe Coding Course - Build Your MVP in 30 Days',
  description: 'Join thousands learning to code and ship fast. Master modern development and launch your MVP within a month.',
  keywords: ['coding course', 'web development', 'MVP', 'Next.js', 'TypeScript', 'React', 'programming'],
  authors: [{ name: 'Vibe Coding' }],
  creator: 'Vibe Coding',
  publisher: 'Vibe Coding',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vibecoding.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vibe Coding Course - Build Your MVP in 30 Days',
    description: 'Join thousands learning to code and ship fast. Master modern development and launch your MVP within a month.',
    url: 'https://vibecoding.com',
    siteName: 'Vibe Coding',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vibe Coding Course - Build Your MVP in 30 Days',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe Coding Course - Build Your MVP in 30 Days',
    description: 'Join thousands learning to code and ship fast. Master modern development and launch your MVP within a month.',
    images: ['/og-image.jpg'],
    creator: '@vibecoding',
    site: '@vibecoding',
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "Vibe Coding Course",
              "description": "Build Your MVP in 30 Days",
              "provider": {
                "@type": "Organization",
                "name": "Vibe Coding",
                "url": "https://vibecoding.com"
              },
              "courseMode": "online",
              "educationalLevel": "beginner",
              "inLanguage": "en",
              "url": "https://vibecoding.com",
              "image": "https://vibecoding.com/og-image.jpg",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 