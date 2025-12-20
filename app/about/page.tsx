import AboutSection3 from '@/component/about/AboutSection3'
import ActivitySection2 from '@/component/activity/ActivitySection2'
import BlogSection from '@/component/blog/BlogSection'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import CourseSection from '@/component/course/CourseSection'
import FaqSection from '@/component/faq/FaqSection'
import Layout from '@/component/layout/Layout'
import PopularServiceSection2 from '@/component/service/PopularServiceSection2'
import React from 'react'
import type { Metadata } from 'next'
import { ActivityType, BlogType, CourseType, FaqType, ServiceType } from '@/types'
import { getActivity, getBlog, getCourse, getFaq, getService } from '@/sanity/sanity.query'
 
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://www.my-office.am';
  
  return {
    title: 'About Us | My Office Armenia - Premium Office Furniture',
    description: 'Learn about My Office Armenia - your trusted partner for premium office furniture. We offer modern, ergonomic solutions with free delivery, 3D modeling, and installation across Yerevan and Armenia.',
    keywords: [
      'office furniture Armenia',
      'about My Office',
      'office furniture company Yerevan',
      'կահույք ընկերություն',
      'գրասենյակային կահույք Երևան',
    ],
    openGraph: {
      type: 'website',
      url: `${baseUrl}/about`,
      title: 'About Us | My Office Armenia',
      description: 'Learn about My Office Armenia - your trusted partner for premium office furniture.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Armenia',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Us | My Office Armenia',
      description: 'Learn about My Office Armenia - your trusted partner for premium office furniture.',
      images: [`${baseUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
const page = async() => {
  const serviceData: ServiceType[] = await getService();
  const courseData: CourseType[] = await getCourse();
  const faqData: FaqType[] = await getFaq();
  const activityData: ActivityType[] = await getActivity();
  const blogData: BlogType[] = await getBlog();
  return (
    <Layout>
        <BreadcrumbSection header="Մեր մասին" title="Մեր մասին"/>
        <section className="tf__about_us_page mt_195 xs_mt_100">
            <AboutSection3 style=''/>
            {serviceData && <PopularServiceSection2 services={serviceData}/>}
            {courseData && <CourseSection style="tf__popular_courses" courseData={courseData}/>}
            {faqData && <FaqSection img="images/faq_img_2.jpg" faqData={faqData}/>}
            {activityData && <ActivitySection2 style="tf__activities_slider_area pt_95 pb_100" activityData={activityData}/>}
            {blogData && <BlogSection blogData={blogData}/>}
        </section>
    </Layout>
  )
}

export default page