import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'BLOOM — Luxury Floral Atelier',
  description:
    'Premium bouquets, handcrafted and wrapped with care.',

  openGraph: {
    title: 'BLOOM — Luxury Floral Atelier',
    description:
      'Premium bouquets, handcrafted and wrapped with care.',
    siteName: 'BLOOM',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'BLOOM — Luxury Floral Atelier',
    description:
      'Premium bouquets, handcrafted and wrapped with care.',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}