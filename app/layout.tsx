import './globals.css';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:'BLOOM — Luxury Floral Atelier',
  description:'Premium bouquets, handcrafted and wrapped with care.',
  openGraph:{ title:'BLOOM — Luxury Floral Atelier', description:'Premium bouquets, handcrafted and wrapped with care.', images:[{url:'/og-home.png',width:1200,height:630}] },
  twitter:{ card:'summary_large_image', title:'BLOOM — Luxury Floral Atelier', description:'Premium bouquets, handcrafted and wrapped with care.', images:['/og-home.png'] }
};

export default function RootLayout({children}:{children:React.ReactNode}){ return <html lang="en"><body><div className="grain"/>{children}</body></html> }
