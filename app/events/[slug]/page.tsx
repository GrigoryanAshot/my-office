import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import ErrorSection from '@/component/error/ErrorSection'
import EventDetailSection from '@/component/event/EventDetailSection'
import { EventType } from '@/types'
import { getEvent } from '@/sanity/sanity.query'
import EventSchema from '@/components/seo/EventSchema'
import { getBaseUrl } from '@/lib/seo/getBaseUrl'

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const eventData: EventType[] = await getEvent();
  const event = eventData.find((item) => item.slug === params.slug);
  
  if (!event) {
    return {
      title: 'Event Not Found | My Office',
      description: 'The requested event could not be found.',
    };
  }
  
  const baseUrl = getBaseUrl();
  const eventUrl = `${baseUrl}/events/${event.slug}`;
  const description = event.desc ? event.desc.substring(0, 157).trim() + (event.desc.length > 157 ? '...' : '') : `Join ${event.title} - Office furniture event in ${event.location || 'Armenia'}`;
  const image = event.imgSrc?.image ? (event.imgSrc.image.startsWith('http') ? event.imgSrc.image : `${baseUrl}${event.imgSrc.image}`) : `${baseUrl}/images/og-image.jpg`;
  
  return {
    title: `${event.longTitle || event.title} | Events | My Office Armenia`,
    description,
    keywords: [
      'office furniture events',
      'furniture workshops',
      event.title,
      event.location || 'Armenia',
      'կահույք միջոցառումներ',
    ],
    openGraph: {
      type: 'website',
      url: eventUrl,
      title: event.longTitle || event.title,
      description,
      siteName: 'My Office Armenia',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: event.imgSrc?.alt || event.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.longTitle || event.title,
      description,
      images: [image],
    },
    alternates: {
      canonical: eventUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const page = async({ params: paramsPromise } : { params : Promise<{ slug: string }> }) => {
    const eventData: EventType[] = await getEvent()
    const params = await paramsPromise;
    const eventDesc = eventData.find((item) => item.slug === params.slug)
  return (
    <Layout>
        {eventDesc && <EventSchema event={eventDesc} />}
        <BreadcrumbSection header='Event Details' title='Event Details'/>
        {eventDesc ? (
            <EventDetailSection eventDesc={eventDesc}/>
        ):(
            <ErrorSection type='Event'/>
        )}
    </Layout>
  )
}

export default page