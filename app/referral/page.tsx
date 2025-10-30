import { Metadata } from 'next'
import ReferralPublicPage from '@/components/referral-public-page'

export const metadata: Metadata = {
  title: 'Professional Photo Restoration & Animation | Restore Old Photos with AI | BringBack AI',
  description: 'Restore damaged, faded, torn, and water-damaged old photos with advanced AI technology. Bring your loved ones to life with natural animation. Professional photo restoration starting at $2.49.',
  keywords: [
    'photo restoration',
    'old photo restoration',
    'damaged photo repair',
    'faded photo restoration',
    'torn photo repair',
    'water damaged photo restoration',
    'vintage photo restoration',
    'AI photo restoration',
    'photo animation',
    'restore old photos',
    'fix damaged photos',
    'photo repair service',
    'family photo restoration',
    'antique photo restoration',
    'scratched photo repair',
    'yellowed photo restoration',
    'blurry photo enhancement',
    'photo colorization',
    'bring photos to life'
  ].join(', '),
  openGraph: {
    title: 'Professional Photo Restoration & Animation | BringBack AI',
    description: 'Transform damaged vintage photographs into stunning high-resolution images and bring your loved ones to life with AI animation.',
    type: 'website',
    url: 'https://bringback.photos/referral',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BringBack AI - Professional Photo Restoration & Animation'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Photo Restoration & Animation | BringBack AI',
    description: 'Restore damaged photos and animate your loved ones with advanced AI technology.',
    images: ['/og-image.png']
  },
  alternates: {
    canonical: 'https://bringback.photos/referral'
  }
}

export default function ReferralPage() {
  return <ReferralPublicPage />
}