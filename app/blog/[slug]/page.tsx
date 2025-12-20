import BlogDetailSection from '@/component/blog/BlogDetailSection';
import BreadcrumbSection from '@/component/breadcrumb/BreadcrumbSection'
import ErrorSection from '@/component/error/ErrorSection';
import Layout from '@/component/layout/Layout'
import React from 'react'
import type { Metadata } from 'next'
import { BlogType } from '@/types';
import { getBlog } from '@/sanity/sanity.query';
import ArticleSchema from '@/components/seo/ArticleSchema';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';
 
export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  const blogData: BlogType[] = await getBlog();
  const article = blogData.find((item) => item.slug === params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | My Office',
      description: 'The requested article could not be found.',
    };
  }
  
  const baseUrl = getBaseUrl();
  const articleUrl = `${baseUrl}/blog/${article.slug}`;
  const description = article.desc ? article.desc.substring(0, 157).trim() + (article.desc.length > 157 ? '...' : '') : `Read ${article.title} on My Office blog`;
  const image = article.imgSrc?.image ? (article.imgSrc.image.startsWith('http') ? article.imgSrc.image : `${baseUrl}${article.imgSrc.image}`) : `${baseUrl}/images/og-blog.jpg`;
  
  return {
    title: `${article.longTitle || article.title} | My Office Blog`,
    description,
    keywords: [
      'office furniture blog',
      'Armenia office furniture',
      article.category,
      article.title,
      'կահույք բլոգ',
      'գրասենյակային կահույք',
    ],
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.longTitle || article.title,
      description,
      siteName: 'My Office Armenia',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.imgSrc?.alt || article.title,
        }
      ],
      publishedTime: article.date || undefined,
      authors: [article.author || 'My Office'],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.longTitle || article.title,
      description,
      images: [image],
    },
    alternates: {
      canonical: articleUrl,
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

const page = async({ params: paramsPromise }: { params: Promise<{ slug: string }> }) => {
    const blogData: BlogType[] = await getBlog();
    const params = await paramsPromise;
    const blogDesc = blogData.find((item) => item.slug === params.slug);
  return (
    <Layout>
        {blogDesc && <ArticleSchema article={blogDesc} />}
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