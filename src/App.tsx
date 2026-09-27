/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Toast } from './components/Toast';

import { HomeView } from './views/HomeView';
import { OurStoryView } from './views/OurStoryView';
import { MazooqTeaView } from './views/MazooqTeaView';
import { MazooqDatesView } from './views/MazooqDatesView';
import { ShopAllView } from './views/ShopAllView';
import { RetailerPortalView } from './views/RetailerPortalView';
import { GlobalVisionView } from './views/GlobalVisionView';
import { ContactView } from './views/ContactView';

const AppContent: React.FC = () => {
  const { activePage } = useCart();

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'our-story':
        return <OurStoryView />;
      case 'mazooq-tea':
        return <MazooqTeaView />;
      case 'mazooq-dates':
        return <MazooqDatesView />;
      case 'shop-all':
        return <ShopAllView />;
      case 'retailer-portal':
        return <RetailerPortalView />;
      case 'global-vision':
        return <GlobalVisionView />;
      case 'contact':
        return <ContactView />;
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

      {/* Live Search Modal */}
      <SearchModal />

      {/* Product Quick View Detail Modal */}
      <QuickViewModal />

      {/* Floating Micro-interaction Toast */}
      <Toast />
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
