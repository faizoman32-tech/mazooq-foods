/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AccountModal } from './components/AccountModal';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Toast } from './components/Toast';
import { WhatsAppButton } from './components/WhatsAppButton';

import { HomeView } from './views/HomeView';
import { OurStoryView } from './views/OurStoryView';
import { ShopAllView } from './views/ShopAllView';
import { RetailerPortalView } from './views/RetailerPortalView';
import { RetailerDashboardView } from './views/RetailerDashboardView';
import { GlobalVisionView } from './views/GlobalVisionView';
import { ContactView } from './views/ContactView';
import { PolicyView } from './views/PolicyView';
import { pathFor } from './routes';

const SITE_URL = 'https://mazooq.com';

const PAGE_TITLES: Record<string, string> = {
  home: 'Mazooq Foods - Taste the smile | Premium Indian Foods Built with Trust',
  'our-story': 'Our Story - From Assam to Kerala | Mazooq Foods',
  'shop-all': 'Shop All Products | Mazooq Foods',
  'retailer-portal': 'B2B Retailer & Wholesale Portal | Mazooq Foods',
  'retailer-dashboard': 'Retailer Dashboard | Mazooq Foods',
  'global-vision': 'Global Export Vision | Mazooq Foods',
  contact: 'Contact Us | Mazooq Foods',
  'privacy-policy': 'Privacy Policy | Mazooq Foods',
  terms: 'Terms & Conditions | Mazooq Foods',
  'refund-policy': 'Refund & Return Policy | Mazooq Foods',
  'shipping-policy': 'Shipping & Delivery Policy | Mazooq Foods',
};

const AppContent: React.FC = () => {
  const { activePage, shopCategory } = useCart();

  // Keep the tab title and canonical URL in sync with the active page (SEO & UX).
  useEffect(() => {
    document.title = PAGE_TITLES[activePage] || PAGE_TITLES.home;
    const url = SITE_URL + pathFor(activePage, shopCategory);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
  }, [activePage, shopCategory]);

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'our-story':
        return <OurStoryView />;
      case 'shop-all':
        return <ShopAllView />;
      case 'retailer-portal':
        return <RetailerPortalView />;
      case 'retailer-dashboard':
        return <RetailerDashboardView />;
      case 'global-vision':
        return <GlobalVisionView />;
      case 'contact':
        return <ContactView />;
      case 'privacy-policy':
      case 'terms':
      case 'refund-policy':
      case 'shipping-policy':
        return <PolicyView policy={activePage} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fbf1] flex flex-col justify-between selection:bg-[#ffdf93] selection:text-[#00290f]">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {renderActiveView()}
      </main>

      {/* Corporate Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Full Checkout Modal with Cash on Delivery / UPI */}
      <CheckoutModal />

      {/* My Account Modal (customer & retailer login/register) */}
      <AccountModal />

      {/* Live Search Modal */}
      <SearchModal />

      {/* Product Quick View Detail Modal */}
      <QuickViewModal />

      {/* Floating Micro-interaction Toast */}
      <Toast />

      {/* Floating WhatsApp chat button */}
      <WhatsAppButton />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
