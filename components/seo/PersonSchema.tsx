import { TeamType } from '@/types';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface PersonSchemaProps {
  person: TeamType;
  baseUrl?: string;
}

/**
 * Component that renders Person schema (JSON-LD) for SEO
 */
export default function PersonSchema({ person, baseUrl }: PersonSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const personUrl = `${actualBaseUrl}/team/${person.slug}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.designation,
    description: person.about || '',
    image: person.imgSrc?.image ? (person.imgSrc.image.startsWith('http') ? person.imgSrc.image : `${actualBaseUrl}${person.imgSrc.image}`) : undefined,
    worksFor: {
      '@type': 'Organization',
      name: 'My Office Armenia',
    },
    telephone: person.phone ? `+374-${person.phone}` : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
