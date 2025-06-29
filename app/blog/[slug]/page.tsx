import BlogDetailSection from '@/component/blog/BlogDetailSection';
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import ErrorSection from '@/component/error/ErrorSection';
import Layout from '@/component/layout/Layout'
import React from 'react'
import type { Metadata } from 'next'
import { BlogType } from '@/types';
import { getBlog } from '@/sanity/sanity.query';
 
export const metadata: Metadata = {
  title: "My-Office.am",
  description: "My-Office.am - Office Furniture",
}
const page = async({ params: paramsPromise }: { params: Promise<{ slug: string }> }) => {
    const blogData: BlogType[] = await getBlog();
    const params = await paramsPromise;
    const blogDesc = blogData.find((item) => item.slug === params.slug);
  return (
    <Layout>
        <BreadcrumbSection header='Blog Details' title='Blog Details'/>
        {blogDesc ? (
            <BlogDetailSection blogDesc={blogDesc} blogDataArray={blogData}/>
        ):(
            <ErrorSection type='Blog'/>
        )}
    </Layout>
  )
}

export default page