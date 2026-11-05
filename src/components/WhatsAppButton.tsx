import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useCart } from '../context/CartContext';
import { whatsappLink } from '../data/company';

/** Floating "Chat on WhatsApp" button (bottom-right). Hidden while a full-screen dialog is open. */
export const WhatsAppButton: React.FC = () => {
  const { isCheckoutOpen, isCartOpen, quickViewProduct, isSearchOpen, isAccountOpen } = useCart();
  if (isCheckoutOpen || isCartOpen || quickViewProduct || isSearchOpen || isAccountOpen) return null;

  return (
    <a
      href={whatsappLink('Hi Mazooq Foods, I have a question.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Mazooq Foods on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:bg-[#1ebe5a] transition-colors p-3 sm:pl-3 sm:pr-5 sm:py-2.5"
    >
      <WhatsAppIcon className="w-7 h-7 sm:w-6 sm:h-6" />
      <span className="hidden sm:inline text-sm font-semibold">Chat on WhatsApp</span>
    </a>
  );
};
