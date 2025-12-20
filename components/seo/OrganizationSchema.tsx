import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface OrganizationSchemaProps {
  baseUrl?: string;
}

/**
 * Component that renders Organization schema (JSON-LD) for SEO
 * This should be included in the root layout or home page
 */
export default function OrganizationSchema({ baseUrl }: OrganizationSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${actualBaseUrl}#organization`,
    name: 'My Office Armenia',
    alternateName: 'My Office',
    url: actualBaseUrl,
    logo: `${actualBaseUrl}/images/logo.png`,
    image: `${actualBaseUrl}/images/og-image.jpg`,
    description: 'Premium office furniture store in Armenia. Modern, ergonomic, and custom office furniture solutions. Free delivery across Yerevan and Armenia.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AM',
      addressLocality: 'Yerevan',
      addressRegion: 'Yerevan',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Armenia',
    },
    priceRange: '$$',
    telephone: '+374-XX-XXX-XXX', // Update with actual phone number
    email: 'info@my-office.am', // Update with actual email
    sameAs: [
      // Add social media links if available
      // 'https://www.facebook.com/myoffice',
      // 'https://www.instagram.com/myoffice',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
