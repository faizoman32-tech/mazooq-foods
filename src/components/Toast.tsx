import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center gap-3 bg-[#00290f] text-white px-5 py-3.5 rounded-xl shadow-2xl border-l-4 border-[#f2c027] animate-slide-up">
      <CheckCircle2 className="w-5 h-5 text-[#ffdf93] shrink-0" />
      <div>
        <p className="text-xs uppercase tracking-wider font-bold text-[#ffdf93]">
          {toast.title}
        </p>
        <p className="text-xs text-white/85 mt-0.5">{toast.message}</p>
      </div>
    </div>
  );
};
