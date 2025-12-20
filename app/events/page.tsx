import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import AllEventSection from '@/component/event/AllEventSection'
import Layout from '@/component/layout/Layout'
import { getEvent } from '@/sanity/sanity.query'
import { EventType } from '@/types'
import type { Metadata } from 'next'
import React from 'react'
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.my-office.am';
  const eventsUrl = `${baseUrl}/events`;
  
  return {
    title: 'Events | My Office Armenia - Office Furniture Events & Workshops',
    description: 'Join our office furniture events, workshops, and exhibitions in Armenia. Learn about ergonomic solutions, workspace design, and modern office furniture trends.',
    keywords: [
      'office furniture events',
      'furniture workshops Armenia',
      'office furniture exhibitions',
      'կահույք միջոցառումներ',
      'գրասենյակային կահույք իրադարձություններ',
    ],
    openGraph: {
      type: 'website',
      url: eventsUrl,
      title: 'Events | My Office Armenia',
      description: 'Join our office furniture events, workshops, and exhibitions.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Events',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Events | My Office Armenia',
      description: 'Join our office furniture events and workshops.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: eventsUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
  }
const page = async () => {
  const event: EventType[] = await getEvent();
  return (
    <Layout>
        <BreadcrumbSection header='Events' title='Events'/>
        {event && <AllEventSection eventData={event}/>}
    </Layout>
  )
}

export default page