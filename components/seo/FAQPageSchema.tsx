import { FaqType } from '@/types';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface FAQPageSchemaProps {
  faqs: FaqType[];
  baseUrl?: string;
}

/**
 * Component that renders FAQPage schema (JSON-LD) for SEO
 * This should be included in FAQ pages
 */
export default function FAQPageSchema({ faqs, baseUrl }: FAQPageSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const faqUrl = `${actualBaseUrl}/faq`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
