import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface HomePageItemListSchemaProps {
  baseUrl?: string;
}

/**
 * Component that renders ItemList schema for homepage main categories
 * This helps Google understand the main navigation and categories
 */
export default function HomePageItemListSchema({ baseUrl }: HomePageItemListSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  
  const categories = [
    {
      name: 'Սեղաններ և աթոռներ',
      nameEn: 'Tables and Chairs',
      url: `${actualBaseUrl}/furniture`,
    },
    {
      name: 'Փափուկ կահույք',
      nameEn: 'Soft Furniture',
      url: `${actualBaseUrl}/softfurniture`,
    },
    {
      name: 'Պահարաններ և ավելին',
      nameEn: 'Wardrobes and More',
      url: `${actualBaseUrl}/windows`,
    },
    {
      name: 'Այլ',
      nameEn: 'Other',
      url: `${actualBaseUrl}/other`,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${actualBaseUrl}#main-categories`,
    name: 'Main Product Categories',
    description: 'Browse our main office furniture categories: Tables and Chairs, Soft Furniture, Wardrobes and More, and Other products.',
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${category.name} (${category.nameEn})`,
      url: category.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
