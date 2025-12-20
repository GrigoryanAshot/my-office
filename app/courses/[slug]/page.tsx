import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout';
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection';
import ErrorSection from '@/component/error/ErrorSection';
import CourseDetailSection from '@/component/course/CourseDetailSection';
import { CourseType } from '@/types';
import { getCourse } from '@/sanity/sanity.query';
import CourseSchema from '@/components/seo/CourseSchema';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';
 
export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const courses: CourseType[] = await getCourse();
  const course = courses.find((item) => item.slug === params.slug);
  
  if (!course) {
    return {
      title: 'Course Not Found | My Office',
      description: 'The requested course could not be found.',
    };
  }
  
  const baseUrl = getBaseUrl();
  const courseUrl = `${baseUrl}/courses/${course.slug}`;
  const description = course.description ? course.description.substring(0, 157).trim() + (course.description.length > 157 ? '...' : '') : `Learn about ${course.title} - Office furniture course with ${course.instructor || 'expert instructors'}`;
  const image = course.imgSrc?.image ? (course.imgSrc.image.startsWith('http') ? course.imgSrc.image : `${baseUrl}${course.imgSrc.image}`) : `${baseUrl}/images/og-image.jpg`;
  
  return {
    title: `${course.title} | Courses | My Office Armenia`,
    description,
    keywords: [
      'office furniture courses',
      'workspace design training',
      course.title,
      course.instructor || 'office furniture expert',
      'կահույք դասընթացներ',
    ],
  openGraph: {
    type: 'website',
      url: courseUrl,
      title: course.title,
      description,
      siteName: 'My Office Armenia',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: course.imgSrc?.alt || course.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description,
      images: [image],
    },
    alternates: {
      canonical: courseUrl,
    },
    robots: {
      index: true,
      follow: true,
  },
};
}

const page = async({ params: paramsPromise }: { params: Promise<{ slug: string }> }) => {
    const course: CourseType[] = await getCourse();
    const params = await paramsPromise;
    const courseDesc = course.find((item) => item.slug === params.slug);

  return (
    <Layout>
        {courseDesc && <CourseSchema course={courseDesc} />}
    <BreadcrumbSection header="Course Details" title="Course Details" />
    {courseDesc ? (
      <CourseDetailSection
        course={courseDesc}
      />
    ) : (
      <ErrorSection type="Course" />
    )}
  </Layout>
  )
}

export default page