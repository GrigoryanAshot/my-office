import { MetadataRoute } from 'next';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getRedisKeyForCategory, getCategoryDisplayName, type ProductData } from '@/lib/seo/fetchProduct';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';
import type { EventType, CourseType, TeamType, BlogType } from '@/types';
import type { SaleItem } from '@/lib/seo/fetchSale';

// Categories configuration
const softfurnitureCategories = [
  'sofas',
  'armchairs',
  'poufs',
  'takht',
];

const furnitureCategories = [
  'chairs',
  'tables',
];

const wardrobesandmoreCategories = [
  'wardrobes',
  'chests',
  'stands',
  'shelving',
];

const otherCategories = [
  'hangers',
  'wall-decor',
  'wall_decor',
  'whiteboard',
  'podium',
];

// Static pages
const staticPages = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/events', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/courses', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/team', priority: 0.7, changeFrequency: 'yearly' as const },
  { path: '/sale', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/terms-condition', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/softfurniture', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/other', priority: 0.9, changeFrequency: 'daily' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Add static pages
  staticPages.forEach(page => {
    sitemapEntries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  });

  // Add softfurniture category pages and their products
  for (const category of softfurnitureCategories) {
    try {
      // Add category page
      sitemapEntries.push({
        url: `${baseUrl}/softfurniture/${category}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });

      // Add product pages for this category
      const products = await fetchCategoryProducts(category);
      products.forEach((product: ProductData) => {
        sitemapEntries.push({
          url: `${baseUrl}/softfurniture/${category}/${product.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      // Still add the category page even if products fail
      sitemapEntries.push({
        url: `${baseUrl}/softfurniture/${category}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // Add furniture category pages and their products
  for (const category of furnitureCategories) {
    try {
      // Add category page
      sitemapEntries.push({
        url: `${baseUrl}/furniture/${category}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });

      // Add product pages for this category
      const products = await fetchCategoryProducts(category);
      products.forEach((product: ProductData) => {
        sitemapEntries.push({
          url: `${baseUrl}/furniture/${category}/${product.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      // Still add the category page even if products fail
      sitemapEntries.push({
        url: `${baseUrl}/furniture/${category}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // Add wardrobesandmore category pages and their products
  for (const category of wardrobesandmoreCategories) {
    try {
      // Add category page
      sitemapEntries.push({
        url: `${baseUrl}/wardrobesandmore/${category}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });

      // Add product pages for this category
      const products = await fetchCategoryProducts(category);
      products.forEach((product: ProductData) => {
        sitemapEntries.push({
          url: `${baseUrl}/wardrobesandmore/${category}/${product.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      // Still add the category page even if products fail
      sitemapEntries.push({
        url: `${baseUrl}/wardrobesandmore/${category}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // Add other category pages and their products
  for (const category of otherCategories) {
    try {
      // Normalize category name for URL (use wall-decor instead of wall_decor)
      const urlCategory = category === 'wall_decor' ? 'wall-decor' : category;
      
      // Add category page
      sitemapEntries.push({
        url: `${baseUrl}/other/${urlCategory}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });

      // Add product pages for this category
      const products = await fetchCategoryProducts(category);
      products.forEach((product: ProductData) => {
        sitemapEntries.push({
          url: `${baseUrl}/other/${urlCategory}/${product.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      // Still add the category page even if products fail
      const urlCategory = category === 'wall_decor' ? 'wall-decor' : category;
      sitemapEntries.push({
        url: `${baseUrl}/other/${urlCategory}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // Add sale pages
  try {
    const { fetchSaleItems } = await import('@/lib/seo/fetchSale');
    const saleItems = await fetchSaleItems();
    
    // Add sale listing page
    sitemapEntries.push({
      url: `${baseUrl}/sale`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Add sale detail pages
    saleItems.forEach((item: SaleItem) => {
      sitemapEntries.push({
        url: `${baseUrl}/sale/${item.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Error fetching sale items:', error);
    // Still add the sale listing page
    sitemapEntries.push({
      url: `${baseUrl}/sale`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Add events pages
  try {
    const { getEvent } = await import('@/sanity/sanity.query');
    const events = await getEvent();
    
    events.forEach((event: EventType) => {
      sitemapEntries.push({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  // Add courses pages
  try {
    const { getCourse } = await import('@/sanity/sanity.query');
    const courses = await getCourse();
    
    courses.forEach((course: CourseType) => {
      sitemapEntries.push({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  // Add team pages
  try {
    const { getTeam } = await import('@/sanity/sanity.query');
    const team = await getTeam();
    
    team.forEach((member: TeamType) => {
      sitemapEntries.push({
        url: `${baseUrl}/team/${member.slug}`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('Error fetching team:', error);
  }

  // Add blog pages
  try {
    const { getBlog } = await import('@/sanity/sanity.query');
    const blogs = await getBlog();
    
    blogs.forEach((blog: BlogType) => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  return sitemapEntries;
} 