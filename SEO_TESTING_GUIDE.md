# SEO Testing Guide - Google Tools

## 🎯 Quick Start: Test Your SEO Right Now

### 1. **Google Rich Results Test** (Test Structured Data) ⭐

**URL**: https://search.google.com/test/rich-results

**What to Test**:
- ✅ **Category Pages** (should show CollectionPage + BreadcrumbList):
  - `https://your-site.vercel.app/softfurniture/sofas`
  - `https://your-site.vercel.app/softfurniture/armchairs`
  - `https://your-site.vercel.app/other/whiteboard`

- ✅ **Product Pages** (should show Product schema):
  - `https://your-site.vercel.app/softfurniture/sofas/1`
  - `https://your-site.vercel.app/softfurniture/armchairs/1`

**What You Should See**:
- ✅ CollectionPage detected
- ✅ BreadcrumbList detected
- ✅ Product detected (on product pages)
- ✅ No errors

---

### 2. **View Page Source** (Check Metadata)

**How to Test**:
1. Visit your deployed site
2. Right-click → "View Page Source" (or Ctrl+U)
3. Check for:

```html
<!-- Should see optimized title -->
<title>Բազմոցներ | բազմոց | Sofa | Armenia | My Office</title>

<!-- Should see meta description -->
<meta name="description" content="Գտեք 50+ բազմոցներ My Office-ից...">

<!-- Should see keywords -->
<meta name="keywords" content="office furniture Armenia, կահույք Հայաստան...">

<!-- Should see JSON-LD schemas -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  ...
}
</script>
```

---

### 3. **Google Search Console** (Monitor Indexing)

**Setup Steps**:

1. **Go to**: https://search.google.com/search-console
2. **Add Property**: Enter your website URL
3. **Verify Ownership**:
   - **Option A**: HTML file upload (download file, add to `public/` folder)
   - **Option B**: HTML tag (add to `app/layout.tsx` in `<head>`)
   - **Option C**: DNS verification (if you have domain access)

4. **Submit Sitemap**:
   - Go to "Sitemaps" section
   - Submit: `https://your-site.vercel.app/sitemap.xml`

5. **Request Indexing**:
   - Go to "URL Inspection" tool
   - Enter your category/product page URLs
   - Click "Request Indexing"

---

### 4. **Mobile-Friendly Test**

**URL**: https://search.google.com/test/mobile-friendly

**Test your pages** to ensure they're mobile-friendly (important for SEO).

---

### 5. **PageSpeed Insights** (Performance)

**URL**: https://pagespeed.web.dev/

**Test your pages** for:
- Performance score
- Core Web Vitals
- Mobile/Desktop performance

---

## 📊 What to Check After Testing

### ✅ Category Pages Should Have:

1. **Title**: `Armenian | Transliteration | English | Location | My Office`
2. **Description**: Category-specific with item count
3. **Keywords**: All category keywords (Armenian + Translit + English)
4. **CollectionPage Schema**: Lists all products
5. **BreadcrumbList Schema**: Navigation hierarchy
6. **OpenGraph Tags**: For social sharing
7. **Canonical URL**: Proper canonical tag

### ✅ Product Pages Should Have:

1. **Title**: `Product Name | Armenian | Translit | English | My Office`
2. **Description**: Product-specific description
3. **Keywords**: Product + category keywords
4. **Product Schema**: Product information (price, availability, etc.)
5. **BreadcrumbList Schema**: Navigation hierarchy
6. **OpenGraph Tags**: Product image and description
7. **Canonical URL**: Proper canonical tag

---

## 🔍 Testing Checklist

### Immediate Tests (Do Now):

- [ ] **Google Rich Results Test**: Test 1 category page
- [ ] **Google Rich Results Test**: Test 1 product page
- [ ] **View Page Source**: Check metadata is present
- [ ] **Mobile-Friendly Test**: Verify mobile compatibility

### Setup (Do This Week):

- [ ] **Google Search Console**: Add and verify your site
- [ ] **Submit Sitemap**: Submit `sitemap.xml`
- [ ] **Request Indexing**: Request indexing for main pages
- [ ] **PageSpeed Insights**: Check performance scores

### Monitoring (Ongoing):

- [ ] **Search Console**: Monitor indexing status
- [ ] **Search Console**: Check for errors/warnings
- [ ] **Search Console**: Monitor search performance
- [ ] **Analytics**: Track organic traffic (if set up)

---

## 🚀 Quick Test URLs

Replace `your-site.vercel.app` with your actual domain:

### Category Pages:
```
https://your-site.vercel.app/softfurniture/sofas
https://your-site.vercel.app/softfurniture/armchairs
https://your-site.vercel.app/softfurniture/poufs
https://your-site.vercel.app/other/whiteboard
https://your-site.vercel.app/other/wall_decor
https://your-site.vercel.app/other/hangers
https://your-site.vercel.app/other/podium
```

### Product Pages:
```
https://your-site.vercel.app/softfurniture/sofas/1
https://your-site.vercel.app/softfurniture/armchairs/1
https://your-site.vercel.app/other/whiteboard/1
```

---

## 📝 Expected Results

### Google Rich Results Test Should Show:

**For Category Pages**:
```
✅ CollectionPage
  - name: "Բազմոցներ"
  - numberOfItems: 50+
  - itemListElement: [list of products]

✅ BreadcrumbList
  - Home > Soft Furniture > Sofas
```

**For Product Pages**:
```
✅ Product
  - name: "Product Name"
  - price: "150000"
  - availability: "InStock"
  - brand: "My Office"

✅ BreadcrumbList
  - Home > Soft Furniture > Sofas > Product Name
```

---

## 🐛 Troubleshooting

### If Rich Results Test Shows Errors:

1. **Check Page Source**: Verify JSON-LD schemas are present
2. **Check Console**: Look for JavaScript errors
3. **Verify URLs**: Make sure product IDs exist
4. **Check Redis**: Ensure product data is available

### If Pages Aren't Indexing:

1. **Submit Sitemap**: Make sure sitemap is submitted
2. **Request Indexing**: Manually request indexing
3. **Check Robots.txt**: Ensure pages aren't blocked
4. **Wait**: Indexing can take days/weeks

---

## 🎯 Next Steps After Testing

1. **Monitor Search Console**: Check indexing status weekly
2. **Track Rankings**: Monitor keyword rankings
3. **Analyze Performance**: Review search analytics
4. **Optimize**: Improve based on data

---

**Start Testing Now**: https://search.google.com/test/rich-results 🚀

