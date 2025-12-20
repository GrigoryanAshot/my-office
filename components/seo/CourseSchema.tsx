import { CourseType } from '@/types';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface CourseSchemaProps {
  course: CourseType;
  baseUrl?: string;
}

/**
 * Component that renders Course schema (JSON-LD) for SEO
 */
export default function CourseSchema({ course, baseUrl }: CourseSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const courseUrl = `${actualBaseUrl}/courses/${course.slug}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || '',
    image: course.imgSrc?.image ? (course.imgSrc.image.startsWith('http') ? course.imgSrc.image : `${actualBaseUrl}${course.imgSrc.image}`) : undefined,
    provider: {
      '@type': 'Organization',
      name: 'My Office Armenia',
      sameAs: actualBaseUrl,
    },
    instructor: {
      '@type': 'Person',
      name: course.instructor || 'My Office Team',
      image: course.instructorImg?.image ? (course.instructorImg.image.startsWith('http') ? course.instructorImg.image : `${actualBaseUrl}${course.instructorImg.image}`) : undefined,
    },
    courseCode: course.slug,
    numberOfCredits: course.lessons || undefined,
    aggregateRating: course.rating ? {
      '@type': 'AggregateRating',
      ratingValue: course.rating,
      reviewCount: course.review || 0,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: course.price || 0,
      priceCurrency: 'AMD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
