import { Metadata } from 'next';
import SalePageClient from './SalePageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { fetchSaleItems } from '@/lib/seo/fetchSale';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const saleUrl = `${baseUrl}/sale`;
  const items = await fetchSaleItems();
  
  return {
    title: 'Ակցիա | Sale | Office Furniture Discounts | My Office Armenia',
    description: `Գտեք ${items.length}+ ակցիայի ապրանքներ My Office-ից: Զեղչված գրասենյակային կահույք Երևանում և Հայաստանում: Առավելագույն զեղչեր, արագ առաքում:`,
    keywords: [
      'office furniture sale',
      'office furniture discount',
      'furniture sale Armenia',
      'կահույք ակցիա',
      'կահույք զեղչ',
      'գրասենյակային կահույք ակցիա',
      'ակցիա Երևան',
      'sale Yerevan',
    ],
    openGraph: {
      type: 'website',
      url: saleUrl,
      title: 'Ակցիա | Sale | My Office Armenia',
      description: `Գտեք ${items.length}+ ակցիայի ապրանքներ My Office-ից: Զեղչված գրասենյակային կահույք:`,
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'My Office Sale',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ակցիա | Sale | My Office Armenia',
      description: `Գտեք ${items.length}+ ակցիայի ապրանքներ My Office-ից:`,
      images: [`${baseUrl}/images/og-image.jpg`],
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

export default async function SalePage() {
  const items = await fetchSaleItems();
  const baseUrl = getBaseUrl();
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: baseUrl },
    { name: 'Ակցիա', url: `${baseUrl}/sale` },
  ];

  // Convert sale items to ProductData format for CollectionSchema
  const productItems = items.map(item => ({
    id: item.id,
    name: item.title,
    description: item.description || '',
    price: item.price,
    oldPrice: item.oldPrice || item.originalItem?.oldPrice,
    imageUrl: item.imageUrl,
    images: item.images || [],
    type: item.originalItem?.type || item.source || '',
    url: item.link || '',
    isAvailable: true,
  }));

  return (
    <>
      <CollectionSchema
        category="sale"
        categoryName="Ակցիա"
        items={productItems}
        basePath="sale"
                  />
      <BreadcrumbSchema items={breadcrumbItems} />
      <SalePageClient initialItems={items} />
    </>
  );
} 