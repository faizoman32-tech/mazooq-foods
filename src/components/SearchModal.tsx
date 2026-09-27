import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, Product } from '../data/products';
import { Search, X, ShoppingBag, Eye, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, addToCart, setQuickViewProduct } = useCart();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesText =
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ingredients.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesText;
    });
  }, [query, selectedCategory]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#00290f]/80 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
      <div className="relative bg-[#f6fbf1] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#ffdf93]/20 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 bg-[#00290f] text-white border-b border-[#ffdf93]/20">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-serif text-lg font-bold text-white">
              Search Mazooq Pantry & Origin Batches
            </h3>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-[#ffdf93]" />
            <input
              type="text"
              autoFocus
              placeholder="Search Assam CTC, Royal Medjool Dates, W240 Cashews, Banana Chips, Spices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-[#ffdf93] focus:bg-white/15"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-3 text-white/60 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 pt-4 text-xs">
            <span className="text-[#ffdf93] uppercase font-semibold text-[10px] tracking-wider">
              Filter:
            </span>
            {['all', 'tea', 'dates', 'nuts', 'snacks', 'spices'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-semibold tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#f2c027] text-[#181d17]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {cat === 'all' ? 'All (20)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#414941]">
              <Search className="w-10 h-10 text-[#717970]/40 mx-auto mb-2" />
              <p className="font-semibold text-sm">No items found matching "{query}"</p>
              <p className="text-xs text-[#717970] mt-1">
                Try searching for "Assam", "Chai", "Medjool", "Cashew", or "Chips"
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const defaultVariant = product.variants[0];
              return (
                <div
                  key={product.id}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-[#ebefe6] hover:border-[#ffdf93] transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 bg-[#f1f5eb] rounded-lg p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#765b00] tracking-wider block">
                        {product.categoryLabel}
                      </span>
                      <h4 className="font-semibold text-sm text-[#00290f] truncate">{product.name}</h4>
                      <p className="text-xs text-[#414941] truncate hidden sm:block">
                        {product.subtitle}
                      </p>
                      <div className="text-xs font-bold text-[#765b00] mt-0.5">
                        ₹{defaultVariant.price}{' '}
                        <span className="font-normal text-[#717970] text-[10px]">
                          ({defaultVariant.size})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setQuickViewProduct(product);
                        setIsSearchOpen(false);
                      }}
                      className="p-2 text-[#414941] hover:text-[#00290f] hover:bg-[#ebefe6] rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product, defaultVariant.size, defaultVariant.price);
                      }}
                      className="px-3 py-1.5 bg-[#00290f] text-[#ffdf93] hover:bg-[#104020] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#ebefe6] px-6 py-3 text-xs text-[#414941] flex items-center justify-between">
          <span>Showing {filteredProducts.length} certified gourmet items</span>
          <span className="text-[#765b00] font-medium">Export compliant packaging</span>
        </div>
      </div>
    </div>
  );
};
