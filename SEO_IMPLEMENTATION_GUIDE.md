# SEO Implementation Guide

## ✅ Step 1: Product Page Metadata - COMPLETED

We've successfully implemented SEO metadata for product pages, starting with the **sofas** category as a template.

### What Was Implemented

#### 1. **Reusable SEO Utilities** (`lib/seo/`)

- **`productMetadata.ts`**: Generates dynamic metadata (title, description, OpenGraph, Twitter cards) for product pages
- **`productSchema.tsx`**: Generates Product schema (JSON-LD) for structured data
- **`fetchProduct.ts`**: Server-side function to fetch product data from Redis

#### 2. **Product Schema Component** (`components/seo/ProductSchema.tsx`)

- Renders JSON-LD structured data for search engines
- Includes product information, pricing, availability, and brand details

#### 3. **Converted Sofa Detail Page**

- **Before**: Client component (`'use client'`) - no server-side metadata
- **After**: Server component with dynamic metadata generation
  - `app/softfurniture/sofas/[id]/page.tsx` - Server component (metadata)
  - `app/softfurniture/sofas/[id]/SofaDetailClient.tsx` - Client component (UI)
  - `app/softfurniture/sofas/[id]/not-found.tsx` - 404 page

### How It Works

1. **Server Component** (`page.tsx`) fetches product data server-side
2. **`generateMetadata`** function creates SEO metadata from product data
3. **ProductSchema** component adds structured data (JSON-LD)
4. **Client Component** handles all interactive UI (modals, image gallery, etc.)

### SEO Features Added

✅ Dynamic page titles: `{Product Name} | {Category} | My Office Armenia`  
✅ Dynamic meta descriptions (optimized to 160 chars)  
✅ OpenGraph tags for social sharing  
✅ Twitter Card tags  
✅ Product schema (JSON-LD) with:
   - Product name, description, images
   - Price and currency (AMD)
   - Availability status
   - Brand information
   - SKU/ID
   - Category

✅ Canonical URLs  
✅ Proper robots directives  
✅ Keywords meta tags

---

## 📋 How to Apply to Other Product Types

The same pattern can be easily applied to other product categories. Here's the process:

### Step 1: Update `fetchProduct.ts`

Add your category to the mapping functions:

```typescript
// In lib/seo/fetchProduct.ts

export function getRedisKeyForCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    sofas: 'sofas:data:test',
    armchairs: 'armchairs:data:test',
    // Add your category here
    yourCategory: 'yourCategory:data:test',
  };
  return categoryMap[category] || `${category}:data:test`;
}

export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    sofas: 'Բազմոցներ',
    armchairs: 'Բազկաթոռներ',
    // Add your category name here
    yourCategory: 'Your Category Name',
  };
  return categoryNames[category] || category;
}
```

### Step 2: Convert Product Page

For any product detail page (e.g., `app/softfurniture/armchairs/[id]/page.tsx`):

1. **Create Client Component**: Extract UI logic to `ArmchairDetailClient.tsx`
2. **Create Server Component**: New `page.tsx` with metadata generation
3. **Add Schema**: Include `ProductSchema` component

**Example structure:**
```
app/softfurniture/armchairs/[id]/
├── page.tsx (Server - metadata)
├── ArmchairDetailClient.tsx (Client - UI)
└── not-found.tsx (404 page)
```

### Step 3: Template Code

```typescript
// app/softfurniture/armchairs/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArmchairDetailClient from './ArmchairDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('armchairs');
  const categoryName = getCategoryDisplayName('armchairs');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'armchairs',
    categoryName,
  });
}

export default async function ArmchairDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('armchairs');
  const categoryName = getCategoryDisplayName('armchairs');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="armchairs"
        categoryName={categoryName}
      />
      <ArmchairDetailClient item={product} />
    </>
  );
}
```

---

## 🎯 Next Steps

### Priority 2: Category Pages
- Add dynamic metadata for category listing pages
- Add breadcrumb schema
- Optimize category descriptions

### Priority 3: Blog Pages
- Dynamic metadata from Sanity CMS
- Article schema markup
- Author information

### Priority 4: Dynamic Sitemap
- Generate sitemap from all products in Redis
- Include all categories and blog posts
- Set proper priorities and change frequencies

### Priority 5: Analytics Integration
- Google Analytics 4
- Google Search Console verification
- Yandex Metrica (for Armenia market)

---

## 🧪 Testing SEO

### 1. **View Page Source**
Check that metadata tags are present in `<head>`:
- `<title>`
- `<meta name="description">`
- OpenGraph tags (`og:title`, `og:description`, `og:image`)
- JSON-LD schema

### 2. **Google Rich Results Test**
- Visit: https://search.google.com/test/rich-results
- Enter your product page URL
- Verify Product schema is detected

### 3. **Social Media Preview**
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### 4. **Google Search Console**
- Submit sitemap
- Monitor indexing status
- Check for structured data errors

---

## 📝 Notes

- **Server Components**: All metadata generation happens server-side for better SEO
- **Client Components**: Only UI interactions remain client-side
- **Redis Keys**: Make sure Redis keys match your category names
- **Image URLs**: Ensure product images are absolute URLs or properly prefixed
- **Price Format**: Schema extracts numeric price from Armenian dram format

---

## 🔧 Troubleshooting

### Product Not Found
- Check Redis key matches category
- Verify product ID exists in Redis
- Check `getRedisKeyForCategory` mapping

### Metadata Not Showing
- Ensure `generateMetadata` is exported
- Check server component is not using `'use client'`
- Verify product data structure matches `ProductData` interface

### Schema Errors
- Validate JSON-LD at https://validator.schema.org/
- Check price format (should extract numbers)
- Verify image URLs are absolute

---

**Status**: ✅ Step 1 Complete - Sofas category fully implemented with SEO metadata

