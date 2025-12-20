import { Metadata } from 'next';
import HomePage from './home/page';
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

export const metadata: Metadata = {
  title: {
    default: 'Premium Office Furniture in Armenia | My Office',
    template: '%s | My Office Armenia',
  },
  description: 'Discover high-quality office furniture in Armenia. Modern, ergonomic, and custom designs for your workspace. Free delivery across Yerevan and Armenia. Free 3D modeling and installation.',
  keywords: [
    'office furniture Armenia',
    'Armenian office furniture',
    'modern office furniture Yerevan',
    'ergonomic furniture Armenia',
    'custom office furniture Armenia',
    'workspace furniture Armenia',
    'office chairs Armenia',
    'office desks Armenia',
    'կահույք Հայաստան',
    'գրասենյակային կահույք Երևան',
    'ժամանակակից կահույք',
    'էրգոնոմիկ կահույք',
    'անհատական կահույք',
    'անվճար առաքում',
    'անվճար տեղադրում',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['hy_AM', 'en_US'],
    url: getBaseUrl(),
    siteName: 'My Office Armenia',
    title: 'Premium Office Furniture in Armenia | My Office',
    description: 'Discover high-quality office furniture in Armenia. Modern, ergonomic, and custom designs for your workspace. Free delivery across Yerevan and Armenia.',
    images: [
      {
        url: `${getBaseUrl()}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'My Office Armenia Showroom',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Office Furniture in Armenia | My Office',
    description: 'Discover high-quality office furniture in Armenia. Modern, ergonomic, and custom designs for your workspace.',
    images: [`${getBaseUrl()}/images/twitter-image.jpg`],
  },
  alternates: {
    canonical: getBaseUrl(),
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
};

export default function Home() {
  return <HomePage />;
}
