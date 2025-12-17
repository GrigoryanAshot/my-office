/**
 * SEO Keywords Configuration
 * 
 * Add your keywords here for each category.
 * You can provide:
 * - Primary keywords (main terms)
 * - Secondary keywords (related terms)
 * - Long-tail keywords (specific phrases)
 * - Armenian translations
 * 
 * The system will automatically generate variations and combine them.
 */

export interface CategoryKeywords {
  primary: string[];           // Main keywords for this category
  secondary?: string[];        // Related keywords
  longTail?: string[];         // Specific search phrases
  armenian?: string[];         // Armenian translations
  transliteration?: string[];  // Armenian transliteration (Latin letters) - VERY IMPORTANT
  location?: string[];         // Location-based keywords (Yerevan, Armenia, etc.)
  action?: string[];           // Action phrases (buy, order, delivery, etc.)
}

export interface KeywordsConfig {
  [category: string]: CategoryKeywords;
}

/**
 * Default keywords that apply to all categories
 */
const defaultKeywords: CategoryKeywords = {
  primary: [
    'office furniture Armenia',
    'կահույք Հայաստան',
    'գրասենյակային կահույք',
  ],
  secondary: [
    'Armenian office furniture',
    'modern office furniture',
    'ergonomic furniture',
    'custom office furniture',
    'workspace furniture',
  ],
  location: [
    'Yerevan',
    'Երևան',
    'Armenia',
    'Հայաստան',
  ],
  armenian: [
    'ժամանակակից կահույք',
    'էրգոնոմիկ կահույք',
    'անհատական կահույք',
    'բարձրորակ կահույք',
  ],
};

/**
 * Category-specific keywords
 * 
 * ADD YOUR KEYWORDS HERE:
 * 
 * Example format:
 * sofas: {
 *   primary: ['sofa', 'couch', 'բազմոց'],
 *   secondary: ['sectional sofa', 'office sofa', 'կահավորանք'],
 *   longTail: ['buy sofa in Armenia', 'office sofa Yerevan'],
 *   armenian: ['բազմոց Երևան', 'գրասենյակային բազմոց'],
 * }
 */
export const categoryKeywords: KeywordsConfig = {
  // ============================================
  // ADD YOUR KEYWORDS BELOW
  // ============================================
  
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
      'comfortable sofa',
    ],
    longTail: [
      'buy sofa in Armenia',
      'office sofa Yerevan',
      'բազմոց գնել Երևանում',
      'գրասենյակային բազմոց Հայաստան',
    ],
    armenian: [
      'բազմոց Երևան',
      'գրասենյակային բազմոց',
      'ժամանակակից բազմոց',
      'բազմոց Հայաստան',
    ],
  },

  armchairs: {
    primary: [
      'armchair',
      'բազկաթոռ',
      'office armchair',
      'բազկաթոռ Երևան',
    ],
    secondary: [
      'ergonomic armchair',
      'executive chair',
      'կոմֆորտ բազկաթոռ',
      'modern armchair',
    ],
    longTail: [
      'buy armchair Armenia',
      'office armchair Yerevan',
      'բազկաթոռ գնել',
      'էրգոնոմիկ բազկաթոռ',
    ],
    armenian: [
      'բազկաթոռ Երևան',
      'գրասենյակային բազկաթոռ',
      'էրգոնոմիկ բազկաթոռ',
    ],
  },

  poufs: {
    primary: [
      'pouf',
      'ottoman',
      'պուֆ',
      'office pouf',
    ],
    secondary: [
      'footstool',
      'decorative pouf',
      'կահավորանք',
    ],
    longTail: [
      'buy pouf Armenia',
      'office pouf Yerevan',
      'պուֆ գնել',
    ],
    armenian: [
      'պուֆ Երևան',
      'դեկորատիվ պուֆ',
    ],
  },

  whiteboard: {
    primary: [
      'whiteboard',
      'white board',
      'սպիտակ գրատախտակ',
      'office whiteboard',
    ],
    secondary: [
      'magnetic whiteboard',
      'wall whiteboard',
      'գրատախտակ',
    ],
    longTail: [
      'buy whiteboard Armenia',
      'office whiteboard Yerevan',
      'սպիտակ գրատախտակ գնել',
    ],
    armenian: [
      'սպիտակ գրատախտակ Երևան',
      'մագնիսական գրատախտակ',
    ],
  },

  // ============================================
  // COMPREHENSIVE KEYWORDS FROM USER
  // ============================================

  chairs: {
    primary: [
      'office chair',
      'ergonomic chair',
      'desk chair',
      'աթոռ',
      'գրասենյակային աթոռ',
    ],
    secondary: [
      'օֆիսային աթոռ',
      'էրգոնոմիկ աթոռ',
      'աշխատասենյակի աթոռ',
    ],
    transliteration: [
      'ator',
      'grasenyakayinner ator',
      'ofisayin ator',
      'ergonomik ator',
      'ashkhataskenyaki ator',
      'ator yerevan',
      'ator hayastan',
      'gnel ator',
      'ator arakum',
    ],
    armenian: [
      'աթոռ',
      'գրասենյակային աթոռ',
      'օֆիսային աթոռ',
      'էրգոնոմիկ աթոռ',
      'աշխատասենյակի աթոռ',
      'աթոռ Երևան',
      'աթոռ Հայաստան',
    ],
    location: [
      'աթոռ Երևան',
      'աթոռ Հայաստան',
      'ator yerevan',
      'ator hayastan',
      'office chair Yerevan',
      'buy office chair Armenia',
    ],
    action: [
      'գնել աթոռ',
      'աթոռի առաքում',
      'gnel ator',
      'ator arakum',
      'buy office chair',
      'buy office chair Armenia',
    ],
    longTail: [
      'buy office chair Armenia',
      'office chair Yerevan',
      'ergonomic chair Armenia',
      'գնել աթոռ Երևանում',
    ],
  },

  tables: {
    primary: [
      'office table',
      'office desk',
      'work desk',
      'սեղան',
      'գրասենյակային սեղան',
    ],
    secondary: [
      'աշխատանքային սեղան',
      'օֆիսային սեղան',
      'գրասենյակի սեղան',
    ],
    transliteration: [
      'seghan',
      'grasenyakayinner seghan',
      'ashkhatankayin seghan',
      'ofisayin seghan',
      'seghan yerevan',
      'seghan gnel',
    ],
    armenian: [
      'սեղան',
      'գրասենյակային սեղան',
      'աշխատանքային սեղան',
      'օֆիսային սեղան',
      'սեղան Երևան',
      'սեղան գնել',
      'գրասենյակի սեղան',
    ],
    location: [
      'սեղան Երևան',
      'seghan yerevan',
      'office table Yerevan',
    ],
    action: [
      'սեղան գնել',
      'seghan gnel',
      'buy office table',
    ],
    longTail: [
      'office table Yerevan',
      'buy office desk Armenia',
      'գնել սեղան Երևանում',
    ],
  },

  wardrobes: {
    primary: [
      'wardrobe',
      'office wardrobe',
      'storage cabinet',
      'զգեստապահարան',
      'գրասենյակային պահարան',
    ],
    secondary: [
      'հագուստի պահարան',
    ],
    transliteration: [
      'zgestapaharan',
      'grasenyakayinner paharan',
      'hagusti paharan',
      'paharan yerevan',
      'gnel zgestapaharan',
    ],
    armenian: [
      'զգեստապահարան',
      'գրասենյակային պահարան',
      'հագուստի պահարան',
      'պահարան Երևան',
      'գնել զգեստապահարան',
    ],
    location: [
      'պահարան Երևան',
      'paharan yerevan',
      'wardrobe Armenia',
    ],
    action: [
      'գնել զգեստապահարան',
      'gnel zgestapaharan',
      'buy wardrobe',
    ],
    longTail: [
      'wardrobe Armenia',
      'buy office wardrobe Yerevan',
      'գնել զգեստապահարան Երևանում',
    ],
  },

  chests: {
    primary: [
      'chest of drawers',
      'office chest',
      'storage drawers',
      'կոմոդ',
      'պահարան կոմոդ',
    ],
    secondary: [
      'գրասենյակային կոմոդ',
    ],
    transliteration: [
      'komod',
      'paharan komod',
      'grasenyakayinner komod',
      'komod yerevan',
      'gnel komod',
    ],
    armenian: [
      'կոմոդ',
      'պահարան կոմոդ',
      'գրասենյակային կոմոդ',
      'կոմոդ Երևան',
      'գնել կոմոդ',
    ],
    location: [
      'կոմոդ Երևան',
      'komod yerevan',
    ],
    action: [
      'գնել կոմոդ',
      'gnel komod',
      'buy chest of drawers',
    ],
    longTail: [
      'buy office chest Armenia',
      'գնել կոմոդ Երևանում',
    ],
  },

  takht: {
    primary: [
      'platform bed',
      'wooden platform',
      'loft takht',
      'թախտ',
      'փայտե թախտ',
    ],
    secondary: [
      'բազմաֆունկցիոնալ թախտ',
    ],
    transliteration: [
      'takht',
      'payte takht',
      'bazmakarg takht',
      'takht yerevan',
      'gnel takht',
    ],
    armenian: [
      'թախտ',
      'փայտե թախտ',
      'բազմաֆունկցիոնալ թախտ',
      'թախտ Երևան',
      'գնել թախտ',
    ],
    location: [
      'թախտ Երևան',
      'takht yerevan',
    ],
    action: [
      'գնել թախտ',
      'gnel takht',
      'buy platform bed',
    ],
    longTail: [
      'buy platform bed Armenia',
      'գնել թախտ Երևանում',
    ],
  },

  stands: {
    primary: [
      'display stand',
      'office stand',
      'showroom stand',
      'ստենդ',
      'ցուցադրական ստենդ',
    ],
    secondary: [
      'գրասենյակային ստենդ',
    ],
    transliteration: [
      'stend',
      'tsutsadrakan stend',
      'grasenyakayinner stend',
      'stend yerevan',
    ],
    armenian: [
      'ստենդ',
      'ցուցադրական ստենդ',
      'գրասենյակային ստենդ',
      'ստենդ Երևան',
    ],
    location: [
      'ստենդ Երևան',
      'stend yerevan',
    ],
    longTail: [
      'buy display stand Armenia',
      'office stand Yerevan',
    ],
  },

  shelving: {
    primary: [
      'shelves',
      'office shelving',
      'wall shelves',
      'դարակ',
      'գրասենյակային դարակ',
    ],
    secondary: [
      'պատի դարակ',
      'պահեստավորման դարակ',
    ],
    transliteration: [
      'darak',
      'grasenyakayinner darak',
      'pati darak',
      'pahestavorman darak',
      'darak yerevan',
    ],
    armenian: [
      'դարակ',
      'գրասենյակային դարակ',
      'պատի դարակ',
      'պահեստավորման դարակ',
      'դարակ Երևան',
    ],
    location: [
      'դարակ Երևան',
      'darak yerevan',
    ],
    longTail: [
      'buy office shelving Armenia',
      'գնել դարակ Երևանում',
    ],
  },

  hangers: {
    primary: [
      'coat hanger',
      'office hanger',
      'standing hanger',
      'կախիչ',
      'հագուստի կախիչ',
    ],
    secondary: [
      'գրասենյակային կախիչ',
    ],
    transliteration: [
      'kakhich',
      'hagusti kakhich',
      'grasenyakayinner kakhich',
      'kakhich yerevan',
    ],
    armenian: [
      'կախիչ',
      'հագուստի կախիչ',
      'գրասենյակային կախիչ',
      'կախիչ Երևան',
    ],
    location: [
      'կախիչ Երևան',
      'kakhich yerevan',
    ],
    longTail: [
      'buy coat hanger Armenia',
      'office hanger Yerevan',
    ],
  },

  'wall-decor': {
    primary: [
      'wall decor',
      'office wall decor',
      'interior wall design',
      'պատի դեկոր',
      'պատի ձևավորում',
    ],
    secondary: [
      'գրասենյակի դեկոր',
    ],
    transliteration: [
      'pati dekor',
      'pati dzevormum',
      'grasenyaki dekor',
      'dekor yerevan',
    ],
    armenian: [
      'պատի դեկոր',
      'պատի ձևավորում',
      'գրասենյակի դեկոր',
      'դեկոր Երևան',
    ],
    location: [
      'դեկոր Երևան',
      'dekor yerevan',
    ],
    longTail: [
      'buy wall decor Armenia',
      'office wall decor Yerevan',
    ],
  },

  'wall_decor': {
    primary: [
      'wall decor',
      'office wall decor',
      'interior wall design',
      'պատի դեկոր',
      'պատի ձևավորում',
    ],
    secondary: [
      'գրասենյակի դեկոր',
    ],
    transliteration: [
      'pati dekor',
      'pati dzevormum',
      'grasenyaki dekor',
      'dekor yerevan',
    ],
    armenian: [
      'պատի դեկոր',
      'պատի ձևավորում',
      'գրասենյակի դեկոր',
      'դեկոր Երևան',
    ],
    location: [
      'դեկոր Երևան',
      'dekor yerevan',
    ],
    longTail: [
      'buy wall decor Armenia',
      'office wall decor Yerevan',
    ],
  },

  podium: {
    primary: [
      'podium',
      'speaker podium',
      'event podium',
      'պոդիում',
      'ելույթի պոդիում',
    ],
    secondary: [
      'միջոցառման պոդիում',
    ],
    transliteration: [
      'podium',
      'yeluyti podium',
      'mijotsarman podium',
      'podium yerevan',
    ],
    armenian: [
      'պոդիում',
      'ելույթի պոդիում',
      'միջոցառման պոդիում',
      'պոդիում Երևան',
    ],
    location: [
      'պոդիում Երևան',
      'podium yerevan',
    ],
    longTail: [
      'buy podium Armenia',
      'event podium Yerevan',
    ],
  },

  // ============================================
  // ADD MORE CATEGORIES BELOW
  // ============================================
  
  // Example template - copy and modify:
  // chairs: {
  //   primary: ['chair', 'աթոռ', 'office chair'],
  //   secondary: ['ergonomic chair', 'desk chair'],
  //   longTail: ['buy chair Armenia', 'office chair Yerevan'],
  //   armenian: ['աթոռ Երևան', 'գրասենյակային աթոռ'],
  // },
};

/**
 * Generates keyword variations automatically
 */
function generateKeywordVariations(keywords: string[], category: string, categoryName: string): string[] {
  const variations: string[] = [];
  
  keywords.forEach(keyword => {
    // Add location variations
    variations.push(`${keyword} Yerevan`);
    variations.push(`${keyword} Armenia`);
    variations.push(`${keyword} Երևան`);
    variations.push(`${keyword} Հայաստան`);
    
    // Add "buy" variations
    variations.push(`buy ${keyword}`);
    variations.push(`buy ${keyword} Armenia`);
    variations.push(`${keyword} գնել`);
    variations.push(`${keyword} գնել Երևանում`);
    
    // Add "office" variations (if not already present)
    if (!keyword.toLowerCase().includes('office')) {
      variations.push(`office ${keyword}`);
    }
  });
  
  return variations;
}

/**
 * Gets all keywords for a category
 * Combines category-specific keywords with defaults and generates variations
 */
export function getKeywordsForCategory(
  category: string,
  productName?: string,
  productType?: string
): string[] {
  const categoryKw = categoryKeywords[category] || {};
  const allKeywords: string[] = [];
  
  // Add product-specific keywords
  if (productName) {
    allKeywords.push(productName);
  }
  if (productType) {
    allKeywords.push(productType);
  }
  
  // Add category primary keywords
  if (categoryKw.primary) {
    allKeywords.push(...categoryKw.primary);
  }
  
  // Add default primary keywords
  allKeywords.push(...defaultKeywords.primary);
  
  // Add category secondary keywords
  if (categoryKw.secondary) {
    allKeywords.push(...categoryKw.secondary);
  }
  
  // Add default secondary keywords
  if (defaultKeywords.secondary) {
    allKeywords.push(...defaultKeywords.secondary);
  }
  
  // Add category long-tail keywords
  if (categoryKw.longTail) {
    allKeywords.push(...categoryKw.longTail);
  }
  
  // Add category Armenian keywords (VERY IMPORTANT for local search)
  if (categoryKw.armenian) {
    allKeywords.push(...categoryKw.armenian);
  }
  
  // Add default Armenian keywords
  if (defaultKeywords.armenian) {
    allKeywords.push(...defaultKeywords.armenian);
  }
  
  // Add transliteration keywords (VERY IMPORTANT for local search)
  if (categoryKw.transliteration) {
    allKeywords.push(...categoryKw.transliteration);
  }
  
  // Add action keywords
  if (categoryKw.action) {
    allKeywords.push(...categoryKw.action);
  }
  
  // Add location keywords
  if (categoryKw.location) {
    allKeywords.push(...categoryKw.location);
  }
  if (defaultKeywords.location) {
    allKeywords.push(...defaultKeywords.location);
  }
  
  // Generate some variations (limit to avoid too many)
  const categoryName = categoryKw.primary?.[0] || category;
  const variations = generateKeywordVariations(
    categoryKw.primary?.slice(0, 3) || [category],
    category,
    categoryName
  );
  allKeywords.push(...variations.slice(0, 5)); // Limit variations
  
  // Remove duplicates and empty strings
  return Array.from(new Set(allKeywords.filter(Boolean))).slice(0, 40); // Increased to 40 for better coverage
}

/**
 * Gets optimized title keywords (1 Armenian + 1 translit + 1 English + location)
 * Format: Armenian | Translit | English | Location
 */
export function getTitleKeywords(category: string, categoryName: string): string {
  const categoryKw = categoryKeywords[category] || {};
  
  const armenian = categoryKw.armenian?.[0] || categoryName;
  const translit = categoryKw.transliteration?.[0] || '';
  const english = categoryKw.primary?.find(k => !/[ա-ֆ]/.test(k)) || categoryKw.primary?.[0] || category;
  const location = categoryKw.location?.[0] || 'Armenia';
  
  const parts: string[] = [];
  if (armenian) parts.push(armenian);
  if (translit) parts.push(translit);
  if (english) parts.push(english);
  if (location && !parts.includes(location)) parts.push(location);
  
  return parts.join(' | ');
}

/**
 * Gets keywords as a comma-separated string (for meta keywords tag)
 */
export function getKeywordsString(
  category: string,
  productName?: string,
  productType?: string
): string {
  return getKeywordsForCategory(category, productName, productType).join(', ');
}

