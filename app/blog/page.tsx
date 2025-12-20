import AllBlogSection from '@/component/blog/AllBlogSection'
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import Layout from '@/component/layout/Layout'
import React from 'react'
import type { Metadata } from 'next'
import { BlogType } from '@/types'
import { getBlog } from '@/sanity/sanity.query'
import { getBaseUrl } from '@/lib/seo/getBaseUrl'
 
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const blogUrl = `${baseUrl}/blog`;
  
  return {
    title: 'Blog | Office Furniture Articles & Tips | My Office Armenia',
    description: 'Read our blog for office furniture tips, design ideas, and insights. Learn about ergonomic furniture, workspace design, and office furniture trends in Armenia.',
    keywords: [
      'office furniture blog',
      'office furniture tips',
      'workspace design',
      'ergonomic furniture',
      'office furniture Armenia',
      'կահույք բլոգ',
      'գրասենյակային կահույք',
      'աշխատատեղի դիզայն',
    ],
    openGraph: {
      type: 'website',
      url: blogUrl,
      title: 'Blog | My Office Armenia',
      description: 'Read our blog for office furniture tips, design ideas, and insights.',
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-blog.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Blog',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | My Office Armenia',
      description: 'Read our blog for office furniture tips, design ideas, and insights.',
      images: [`${baseUrl}/images/og-blog.jpg`],
    },
    alternates: {
      canonical: blogUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
const page = async() => {
  const blogData: BlogType[] = await getBlog();
  return (
    <Layout>
        <BreadcrumbSection header="Blog" title="Blog"/>
        {blogData && <AllBlogSection blogData={blogData}/>}
    </Layout>
  )
}

export default page