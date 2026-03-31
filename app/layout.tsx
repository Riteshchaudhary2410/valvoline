import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import ClientInit from '@/components/ClientInit'

export const metadata: Metadata = {
  title: {
    default: 'Valvoline Dealer | Automotive Lubricants for Bikes, Cars, and Trucks',
    template: '%s | Valvoline Dealer',
  },
  description:
    'Find the right Valvoline engine oil, gear oil, grease, hydraulic oil, and industrial lubricant with smart vehicle matching and garage-friendly bulk pricing.',
  keywords: [
    'Valvoline',
    'engine oil',
    'gear oil',
    'grease',
    'hydraulic oil',
    'industrial lubricants',
    'bike oil',
    'car oil',
    'truck oil',
    'bulk lubricant dealer',
  ],
  metadataBase: new URL('https://valvoline.example.com'),
  openGraph: {
    title: 'Valvoline Dealer | Smart Lubricant Shopping',
    description:
      'Industrial-grade lubricant commerce for retail customers, mechanics, and garages.',
    url: 'https://valvoline.example.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valvoline Dealer',
    description: 'Find the right oil for your vehicle and order in one place.',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#270301" />
      </head>
      <body>
        <ClientInit>{children}</ClientInit>
      </body>
    </html>
  )
}
