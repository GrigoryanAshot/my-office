import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import TermSection from '@/component/terms/TermSection'
import { getBaseUrl } from '@/lib/seo/getBaseUrl'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const privacyUrl = `${baseUrl}/privacy-policy`;
  
  return {
    title: 'Privacy Policy | My Office Armenia',
    description: 'Learn how My Office Armenia protects your privacy. Read our privacy policy regarding data collection, usage, and protection when shopping for office furniture in Armenia.',
    keywords: [
      'privacy policy',
      'data protection',
      'office furniture privacy',
      'գաղտնիության քաղաքականություն',
      'տվյալների պաշտպանություն',
    ],
    openGraph: {
      type: 'website',
      url: privacyUrl,
      title: 'Privacy Policy | My Office Armenia',
      description: 'Learn how My Office Armenia protects your privacy and handles your data.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Privacy Policy',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy | My Office Armenia',
      description: 'Learn how My Office Armenia protects your privacy.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: privacyUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
const page = () => {
  return (
    <Layout>
        <BreadcrumbSection title='Privacy Policy' header='Privacy Policy'/>
        <TermSection/>
    </Layout>
  )
}

export default page