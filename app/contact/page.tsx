import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import ContactPageSection from '@/component/contact/ContactPageSection'
import Layout from '@/component/layout/Layout'
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
 
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.my-office.am';
  
  return {
    title: 'Contact Us | My Office Armenia - Get in Touch',
    description: 'Contact My Office Armenia for office furniture inquiries. Visit our showroom in Yerevan or reach out for free consultation, 3D modeling, and custom office furniture solutions.',
    keywords: [
      'contact office furniture Armenia',
      'office furniture Yerevan',
      'office furniture consultation',
      'կապ կահույք',
      'գրասենյակային կահույք Երևան',
      'կոնսուլտացիա',
    ],
    openGraph: {
      type: 'website',
      url: `${baseUrl}/contact`,
      title: 'Contact Us | My Office Armenia',
      description: 'Contact My Office Armenia for office furniture inquiries. Visit our showroom in Yerevan or reach out for free consultation.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Armenia Contact',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us | My Office Armenia',
      description: 'Contact My Office Armenia for office furniture inquiries.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/contact`,
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
        <BreadcrumbSection header='Կապ մեզ հետ' title="Կապ մեզ հետ"/>
        <ContactPageSection/>
    </Layout>
  )
}

export default page