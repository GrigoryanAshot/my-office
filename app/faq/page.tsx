import React from 'react'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import AllFaqSection from '@/component/faq/AllFaqSection'
import type { Metadata } from 'next'
import { FaqType } from '@/types'
import { getFaq } from '@/sanity/sanity.query'
import FAQPageSchema from '@/components/seo/FAQPageSchema'
import { getBaseUrl } from '@/lib/seo/getBaseUrl'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const faqUrl = `${baseUrl}/faq`;
  
  return {
    title: 'Frequently Asked Questions | My Office Armenia',
    description: 'Find answers to common questions about office furniture, delivery, installation, and custom orders. Get help with your office furniture needs in Armenia.',
    keywords: [
      'office furniture FAQ',
      'office furniture questions',
      'office furniture Armenia',
      'կահույք հարցեր',
      'կահույք պատասխաններ',
      'գրասենյակային կահույք հարցեր',
    ],
    openGraph: {
      type: 'website',
      url: faqUrl,
      title: 'FAQ | My Office Armenia',
      description: 'Find answers to common questions about office furniture, delivery, and installation.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office FAQ',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FAQ | My Office Armenia',
      description: 'Find answers to common questions about office furniture.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: faqUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

const page = async() => {
  const faqData: FaqType[] = await getFaq();
  return (
    <Layout>
        {faqData && faqData.length > 0 && <FAQPageSchema faqs={faqData} />}
        <BreadcrumbSection title='FAQ' header="FAQ"/>
        {faqData && <AllFaqSection faqData={faqData}/>}
    </Layout>
  )
}

export default page