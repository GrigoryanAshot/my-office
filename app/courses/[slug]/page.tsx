import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout';
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection';
import ErrorSection from '@/component/error/ErrorSection';
import CourseDetailSection from '@/component/course/CourseDetailSection';
import { CourseType } from '@/types';
import { getCourse } from '@/sanity/sanity.query';
 
export const metadata: Metadata = {
  title: "My-Office.am",
  description: "Developed by Ashot Grigoryan",
  openGraph: {
    title: 'Course Details',
    description: 'View detailed information about this course',
    type: 'website',
  },
};

const page = async({ params: paramsPromise }: { params: Promise<{ slug: string }> }) => {
    const course: CourseType[] = await getCourse();
    const params = await paramsPromise;
    const courseDesc = course.find((item) => item.slug === params.slug); // Use 'slug' here

  return (
    <Layout>
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