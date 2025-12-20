import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface ServiceSchemaProps {
  baseUrl?: string;
}

/**
 * Component that renders Service schema for homepage services
 * Lists the main services offered: Free delivery, 3D modeling, installation, measurement
 */
export default function ServiceSchema({ baseUrl }: ServiceSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  
  const services = [
    {
      name: 'Free Measurement',
      nameHy: 'Անվճար չափագրում',
      description: 'Free professional measurement service for your office space',
    },
    {
      name: 'Free 3D Modeling',
      nameHy: 'Անվճար 3D մոդելավորում',
      description: 'Free 3D modeling and visualization of your office furniture layout',
    },
    {
      name: 'Free Delivery',
      nameHy: 'Անվճար առաքում',
      description: 'Free delivery across Yerevan and Armenia',
    },
    {
      name: 'Free Installation',
      nameHy: 'Անվճար տեղադրում',
      description: 'Free professional installation service for all furniture',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${actualBaseUrl}#services`,
    serviceType: 'Office Furniture Services',
    provider: {
      '@id': `${actualBaseUrl}#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Armenia',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Office Furniture Services',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: `${service.name} (${service.nameHy})`,
          description: service.description,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
