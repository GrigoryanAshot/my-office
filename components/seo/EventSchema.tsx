import { EventType } from '@/types';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface EventSchemaProps {
  event: EventType;
  baseUrl?: string;
}

/**
 * Component that renders Event schema (JSON-LD) for SEO
 */
export default function EventSchema({ event, baseUrl }: EventSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const eventUrl = `${actualBaseUrl}/events/${event.slug}`;
  
  // Parse date/time for schema
  // EventType has 'time' (time string like "10:00 AM") but not 'date'
  // Use current date as fallback since we don't have date information
  const startDate = new Date().toISOString();
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.longTitle || event.title,
    description: event.desc || '',
    image: event.imgSrc?.image ? (event.imgSrc.image.startsWith('http') ? event.imgSrc.image : `${actualBaseUrl}${event.imgSrc.image}`) : undefined,
    startDate: startDate,
    location: {
      '@type': 'Place',
      name: event.location || 'Yerevan, Armenia',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Yerevan',
        addressCountry: 'AM',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'My Office Armenia',
    },
    offers: event.price ? {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'AMD',
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
