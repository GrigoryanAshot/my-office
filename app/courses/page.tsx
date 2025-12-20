import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import AllCourseSection from '@/component/course/AllCourseSection'
import { CourseType } from '@/types'
import { getCourse } from '@/sanity/sanity.query'
 
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.my-office.am';
  const coursesUrl = `${baseUrl}/courses`;
  
  return {
    title: 'Courses | My Office Armenia - Office Furniture Training & Education',
    description: 'Learn about office furniture, workspace design, and ergonomic solutions through our courses and training programs in Armenia.',
    keywords: [
      'office furniture courses',
      'workspace design training',
      'ergonomic furniture education',
      'կահույք դասընթացներ',
      'աշխատատեղի դիզայն ուսուցում',
    ],
    openGraph: {
      type: 'website',
      url: coursesUrl,
      title: 'Courses | My Office Armenia',
      description: 'Learn about office furniture and workspace design through our courses.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Courses',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Courses | My Office Armenia',
      description: 'Learn about office furniture and workspace design.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: coursesUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
const page = async() => {
  const course: CourseType[] = await getCourse();
  return (
    <Layout>
        <BreadcrumbSection header='All Course' title='All Course'/>
        {course && <AllCourseSection courses={course}/>}
    </Layout>
  )
}

export default page