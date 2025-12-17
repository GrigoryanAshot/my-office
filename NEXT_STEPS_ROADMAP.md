# SEO Implementation - Next Steps Roadmap

## ✅ What's Completed

1. **Product Page SEO** ✅
   - 4 categories converted (sofas, armchairs, poufs, whiteboard)
   - Server components with dynamic metadata
   - Product schema (JSON-LD)
   - Comprehensive keywords system (10+ categories)

2. **Keywords System** ✅
   - All categories have keywords (Armenian + Transliteration + English)
   - Automatic keyword application
   - SEO-optimized titles

---

## 🎯 Recommended Next Steps (Priority Order)

### **Priority 1: Category Pages SEO** ⭐ HIGHEST IMPACT

**What:** Add SEO metadata to category listing pages (e.g., `/softfurniture/sofas`, `/softfurniture/armchairs`)

**Why:** 
- These are high-traffic landing pages
- Currently have NO SEO metadata (they're client components)
- Critical for category-level search rankings
- Users often land here first

**What We'll Add:**
- Dynamic metadata (title, description, keywords)
- Category-specific keywords
- Breadcrumb schema
- Collection schema (ItemList)
- OpenGraph tags

**Impact:** 🔥 HIGH - These pages get lots of traffic

---

### **Priority 2: Dynamic Sitemap** ⭐ HIGH IMPACT

**What:** Generate sitemap automatically from all products in Redis

**Why:**
- Current sitemap is static/hardcoded
- Doesn't include all products
- Search engines need to discover all pages
- Better indexing = more traffic

**What We'll Add:**
- Dynamic sitemap generation from Redis
- All product pages included
- All category pages included
- Proper priorities and change frequencies
- Last modified dates

**Impact:** 🔥 HIGH - Better search engine discovery

---

### **Priority 3: Blog Pages SEO** ⭐ MEDIUM IMPACT

**What:** Add SEO metadata to blog detail pages

**Why:**
- Blog content helps with SEO
- Article schema helps with rich results
- Better social sharing

**What We'll Add:**
- Dynamic metadata from Sanity CMS
- Article schema (JSON-LD)
- Author information
- Publish dates
- Reading time

**Impact:** 📊 MEDIUM - Good for content marketing

---

### **Priority 4: Convert Remaining Product Pages** ⭐ MEDIUM IMPACT

**What:** Convert remaining product detail pages to server components

**Why:**
- More product pages = more SEO coverage
- Consistent SEO across all products

**Remaining:**
- Chairs, Tables, Wardrobes, Chests, Takht, Stands, Shelving, Hangers, Wall Decor, Podium, etc.

**Impact:** 📊 MEDIUM - More pages indexed

---

### **Priority 5: Analytics & Monitoring** ⭐ ONGOING

**What:** Set up tracking and monitoring

**Why:**
- Track SEO performance
- Monitor rankings
- Identify opportunities

**What We'll Add:**
- Google Analytics 4
- Google Search Console verification
- Yandex Metrica (for Armenia market)

**Impact:** 📈 ONGOING - Essential for optimization

---

## 🚀 My Recommendation: Start with Priority 1

**Category Pages SEO** is the best next move because:

1. ✅ **High Impact** - Category pages are entry points
2. ✅ **Quick Win** - Can be done relatively quickly
3. ✅ **Uses Existing System** - We already have keywords configured
4. ✅ **Immediate Benefit** - Better rankings for category searches

**Example:**
- Current: `/softfurniture/sofas` - No SEO metadata
- After: Full SEO with keywords, schema, optimized title/description

---

## 📋 What Each Step Involves

### Step 1: Category Pages SEO
- Create category metadata generator
- Add Collection/ItemList schema
- Add breadcrumb schema
- Convert category pages to server components (or add metadata wrapper)
- Use existing keywords system

### Step 2: Dynamic Sitemap
- Fetch all products from Redis
- Generate sitemap entries dynamically
- Include all categories
- Set proper priorities

### Step 3: Blog Pages SEO
- Add Article schema
- Dynamic metadata from Sanity
- Author and date information

---

## ⏱️ Estimated Time

- **Priority 1 (Category Pages):** ~30-45 minutes
- **Priority 2 (Dynamic Sitemap):** ~20-30 minutes
- **Priority 3 (Blog Pages):** ~20-30 minutes
- **Priority 4 (Remaining Products):** ~2-3 hours (batch conversion)
- **Priority 5 (Analytics):** ~15-20 minutes

---

## 🎯 What Would You Like to Do?

**Option A:** Start with **Category Pages SEO** (Recommended - highest impact)  
**Option B:** Create **Dynamic Sitemap** (Quick win, better indexing)  
**Option C:** Convert **More Product Pages** (More coverage)  
**Option D:** Set up **Analytics** (Monitoring)  
**Option E:** Something else?

Let me know and I'll implement it! 🚀

