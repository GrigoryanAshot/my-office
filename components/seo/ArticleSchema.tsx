import { BlogType } from '@/types';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface ArticleSchemaProps {
  article: BlogType;
  baseUrl?: string;
}

/**
 * Component that renders Article schema (JSON-LD) for SEO
 * This should be included in the <head> of blog article pages
 */
export default function ArticleSchema({ article, baseUrl }: ArticleSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const articleUrl = `${actualBaseUrl}/blog/${article.slug}`;
  
  // Parse date for schema
  const publishedDate = article.date ? new Date(article.date).toISOString() : new Date().toISOString();
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.longTitle || article.title,
    description: article.desc || '',
    image: article.imgSrc?.image ? (article.imgSrc.image.startsWith('http') ? article.imgSrc.image : `${actualBaseUrl}${article.imgSrc.image}`) : undefined,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Person',
      name: article.author || 'My Office',
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Office Armenia',
      logo: {
        '@type': 'ImageObject',
        url: `${actualBaseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'Blog',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
