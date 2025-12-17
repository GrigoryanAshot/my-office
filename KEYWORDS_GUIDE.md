# SEO Keywords Guide

## 📝 How to Add Keywords

### Option 1: Add Keywords Per Category (Recommended)

Edit the file: `lib/seo/keywords.ts`

Find the category you want to add keywords for, or add a new one:

```typescript
sofas: {
  primary: [
    'sofa',
    'couch',
    'բազմոց',
    'office sofa',
    'բազմոց Երևան',
  ],
  secondary: [
    'sectional sofa',
    'office couch',
    'կահավորանք',
    'modern sofa',
  ],
  longTail: [
    'buy sofa in Armenia',
    'office sofa Yerevan',
    'բազմոց գնել Երևանում',
  ],
  armenian: [
    'բազմոց Երևան',
    'գրասենյակային բազմոց',
  ],
},
```

### Option 2: Provide Keywords Here

You can provide keywords in any of these formats:

**Format 1: Simple List**
```
sofas: sofa, couch, բազմոց, office sofa, բազմոց Երևան
armchairs: armchair, բազկաթոռ, ergonomic chair
```

**Format 2: Organized by Type**
```
sofas:
  - Primary: sofa, couch, բազմոց
  - Secondary: sectional sofa, office couch
  - Long-tail: buy sofa Armenia, office sofa Yerevan
  - Armenian: բազմոց Երևան, գրասենյակային բազմոց
```

**Format 3: Per Product (if needed)**
```
sofas:
  - Product-specific: leather sofa, fabric sofa, corner sofa
  - Location: sofa Yerevan, sofa Armenia
  - Action: buy sofa, order sofa, sofa delivery
```

---

## 🎯 What Information I Need

### For Each Category, Please Provide:

1. **Primary Keywords** (3-5 main terms)
   - English: `sofa`, `couch`, `office sofa`
   - Armenian: `բազմոց`, `բազմոց Երևան`

2. **Secondary Keywords** (5-10 related terms)
   - Variations: `sectional sofa`, `modern sofa`, `comfortable sofa`
   - Related: `office furniture`, `workspace furniture`

3. **Long-tail Keywords** (3-5 specific phrases)
   - `buy sofa in Armenia`
   - `office sofa Yerevan`
   - `բազմոց գնել Երևանում`

4. **Armenian Keywords** (3-5 Armenian terms)
   - `բազմոց Երևան`
   - `գրասենյակային բազմոց`
   - `ժամանակակից բազմոց`

5. **Location Keywords** (if specific to category)
   - `Yerevan`, `Armenia`, `Երևան`, `Հայաստան`

---

## 📋 Example: Complete Category Keywords

Here's a complete example for **Sofas**:

```typescript
sofas: {
  // Main search terms
  primary: [
    'sofa',
    'couch',
    'բազմոց',
    'office sofa',
    'բազմոց Երևան',
  ],
  
  // Related terms and variations
  secondary: [
    'sectional sofa',
    'office couch',
    'կահավորանք',
    'modern sofa',
    'comfortable sofa',
    'ergonomic sofa',
    'executive sofa',
  ],
  
  // Specific search phrases
  longTail: [
    'buy sofa in Armenia',
    'office sofa Yerevan',
    'բազմոց գնել Երևանում',
    'գրասենյակային բազմոց Հայաստան',
    'best sofa Armenia',
    'sofa delivery Yerevan',
  ],
  
  // Armenian-specific keywords
  armenian: [
    'բազմոց Երևան',
    'գրասենյակային բազմոց',
    'ժամանակակից բազմոց',
    'բազմոց Հայաստան',
    'բարձրորակ բազմոց',
  ],
  
  // Location-specific (optional, if different from default)
  location: [
    'Yerevan center',
    'Երևան կենտրոն',
  ],
},
```

---

## 🔄 Automatic Keyword Generation

The system automatically generates variations:

- **Location variations**: `sofa Yerevan`, `sofa Armenia`, `sofa Երևան`
- **Action variations**: `buy sofa`, `buy sofa Armenia`, `sofa գնել`
- **Office variations**: `office sofa` (if not already present)

So you don't need to add every possible combination - just the main terms!

---

## 📊 Current Categories

### ✅ Already Configured:
- `sofas` - Example keywords added
- `armchairs` - Example keywords added
- `poufs` - Example keywords added
- `whiteboard` - Example keywords added

### ⏳ Need Keywords:
- `chairs`
- `tables`
- `wardrobes`
- `chests`
- `takht`
- `stands`
- `shelving`
- `hangers`
- `wall_decor` / `wall-decor`
- `podium`
- `metal_podium`
- `metal_wall_decor`
- `doors_takht`

---

## 💡 Tips for Good Keywords

1. **Mix Languages**: Include both English and Armenian
2. **Include Location**: Add "Yerevan", "Armenia", "Երևան", "Հայաստան"
3. **Use Action Words**: "buy", "order", "գնել", "պատվիրել"
4. **Be Specific**: "office sofa" is better than just "sofa"
5. **Think Like Customers**: What would someone search for?
6. **Long-tail Keywords**: "buy sofa in Armenia" targets specific searches

---

## 🚀 Quick Start

**Just tell me:**
1. Which category (e.g., "chairs", "tables")
2. A few main keywords (e.g., "chair", "աթոռ", "office chair")
3. Any specific terms you want included

**I'll:**
- Add them to the keywords file
- Generate variations automatically
- Integrate them into the SEO system

---

## 📝 Example Input Format

You can provide keywords like this:

```
Category: chairs
Keywords: chair, աթոռ, office chair, ergonomic chair, desk chair, աթոռ Երևան, գրասենյակային աթոռ
```

Or more detailed:

```
chairs:
  - chair, աթոռ, office chair
  - ergonomic chair, desk chair, executive chair
  - buy chair Armenia, office chair Yerevan
  - աթոռ Երևան, գրասենյակային աթոռ, էրգոնոմիկ աթոռ
```

---

**Ready to add your keywords!** Just provide them in any format above, and I'll integrate them into the system.

