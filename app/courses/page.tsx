import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/component/layout/Layout'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import AllCourseSection from '@/component/course/AllCourseSection'
import { CourseType } from '@/types'
import { getCourse } from '@/sanity/sanity.query'
 
export const metadata: Metadata = {
  title: "My-Office.am",
  description: "My-Office.am - Office Furniture",
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