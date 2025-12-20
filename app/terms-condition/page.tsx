import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import TermSection from '@/component/terms/TermSection'
import { getBaseUrl } from '@/lib/seo/getBaseUrl'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const termsUrl = `${baseUrl}/terms-condition`;
  
  return {
    title: 'Terms and Conditions | My Office Armenia',
    description: 'Read our terms and conditions for office furniture purchases, delivery, returns, and services in Armenia. Understand your rights and responsibilities when shopping with My Office.',
    keywords: [
      'terms and conditions',
      'office furniture terms',
      'purchase terms Armenia',
      'կահույք պայմաններ',
      'գնման պայմաններ',
    ],
    openGraph: {
      type: 'website',
      url: termsUrl,
      title: 'Terms and Conditions | My Office Armenia',
      description: 'Read our terms and conditions for office furniture purchases and services.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Terms and Conditions',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Terms and Conditions | My Office Armenia',
      description: 'Read our terms and conditions for office furniture purchases.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: termsUrl,
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
        <BreadcrumbSection title='Terms And Conditions' header='Terms And Conditions'/>
        <TermSection/>
    </Layout>
  )
}

export default page