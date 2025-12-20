import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SaleDetailClient from './SaleDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchSaleItemById } from '@/lib/seo/fetchSale';
import { generateProductMetadata } from '@/lib/seo/productMetadata';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const saleItem = await fetchSaleItemById(id);
        
        if (!saleItem) {
    return {
      title: 'Sale Item Not Found | My Office',
      description: 'The requested sale item could not be found.',
    };
        }
        
  const baseUrl = getBaseUrl();
  const saleUrl = `${baseUrl}/sale/${id}`;
  const description = saleItem.description 
    ? saleItem.description.substring(0, 157).trim() + (saleItem.description.length > 157 ? '...' : '')
    : `Ակցիա: ${saleItem.title} - Զեղչված գին ${saleItem.price} դրամ My Office-ից: Բարձրորակ գրասենյակային կահույք Երևանում և Հայաստանում`;

  return {
    title: `${saleItem.title} | Ակցիա | Sale | My Office Armenia`,
    description,
    keywords: [
      'office furniture sale',
      'office furniture discount',
      saleItem.title,
      'կահույք ակցիա',
      'կահույք զեղչ',
      'գրասենյակային կահույք ակցիա',
    ],
    openGraph: {
      type: 'website',
      url: saleUrl,
      title: `${saleItem.title} | Sale | My Office`,
      description,
      siteName: 'My Office Armenia',
      images: [
        {
          url: saleItem.imageUrl.startsWith('http') ? saleItem.imageUrl : `${baseUrl}${saleItem.imageUrl}`,
          width: 1200,
          height: 630,
          alt: saleItem.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${saleItem.title} | Sale | My Office`,
      description,
      images: [saleItem.imageUrl.startsWith('http') ? saleItem.imageUrl : `${baseUrl}${saleItem.imageUrl}`],
    },
    alternates: {
      canonical: saleUrl,
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

export default async function SaleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const saleItem = await fetchSaleItemById(id);

  if (!saleItem) {
    notFound();
  }

  // Convert sale item to ProductData format for ProductSchema
  const productData = {
    id: saleItem.id,
    name: saleItem.title,
    description: saleItem.description || '',
    price: saleItem.price,
    oldPrice: saleItem.oldPrice || saleItem.originalItem?.oldPrice,
    imageUrl: saleItem.imageUrl,
    images: saleItem.images || [],
    type: saleItem.originalItem?.type || saleItem.source || '',
    url: saleItem.link || '',
    isAvailable: true,
  };

  return (
    <>
      <ProductSchema
        product={productData}
        category="sale"
        categoryName="Ակցիա"
        basePath="sale"
      />
      <SaleDetailClient item={saleItem} />
    </>
  );
} 