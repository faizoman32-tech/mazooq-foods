// src/routes.ts
// Maps each page of the single-page app to a real URL, so pages can be
// shared, bookmarked, indexed by Google, and the browser Back button works.

export type PageView =
  | 'home'
  | 'our-story'
  | 'shop-all'
  | 'retailer-portal'
  | 'retailer-dashboard'
  | 'global-vision'
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'refund-policy'
  | 'shipping-policy';

export const PAGE_PATHS: Record<PageView, string> = {
  home: '/',
  'our-story': '/our-story',
  'shop-all': '/shop',
  'retailer-portal': '/retailer',
  'retailer-dashboard': '/retailer/dashboard',
  'global-vision': '/global-vision',
  contact: '/contact',
  'privacy-policy': '/privacy-policy',
  terms: '/terms',
  'refund-policy': '/refund-policy',
  'shipping-policy': '/shipping-policy',
};

export const SHOP_CATEGORIES = ['tea', 'dates', 'nuts', 'snacks', 'spices'] as const;

/** URL for a page (and, for the shop, an optional category: /shop/tea). */
export function pathFor(page: PageView, shopCategory = 'all'): string {
  if (page === 'shop-all' && shopCategory !== 'all' && (SHOP_CATEGORIES as readonly string[]).includes(shopCategory)) {
    return `/shop/${shopCategory}`;
  }
  return PAGE_PATHS[page];
}

/** Reads the page (and shop category) from a URL path. Unknown paths → null. */
export function routeFromPath(pathname: string): { page: PageView; shopCategory: string } | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const shop = clean.match(/^\/shop\/([a-z-]+)$/);
  if (shop && (SHOP_CATEGORIES as readonly string[]).includes(shop[1])) {
    return { page: 'shop-all', shopCategory: shop[1] };
  }
  for (const [page, path] of Object.entries(PAGE_PATHS) as [PageView, string][]) {
    if (path === clean) return { page, shopCategory: 'all' };
  }
  return null;
}
