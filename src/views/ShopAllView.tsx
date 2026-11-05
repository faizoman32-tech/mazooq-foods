import React, { useEffect, useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, Product } from '../data/products';
import { retailerUnitPrice, retailerTiersForSize } from '../../shared/retailer-pricing.js';

import { Search, Sparkles, Eye, ShoppingBag, Store, Tag, TrendingDown } from 'lucide-react';


export const ShopAllView: React.FC = () => {
  const { addToCart, setQuickViewProduct, shopCategory, setShopCategory, isApprovedRetailer, retailerCatalog } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(shopCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({}); // retailer qty per product

  // Sync when another view (Home/Footer) opens the Shop with a category preselected.
  useEffect(() => {
    setSelectedCategory(shopCategory || 'all');
  }, [shopCategory]);

  // Approved retailers see the retailer catalog (with pricing tiers) if loaded;
  // otherwise fall back to the public catalog.
  const visibleProducts: Product[] = isApprovedRetailer && retailerCatalog
    ? retailerCatalog
    : PRODUCTS;

  const filteredProducts = useMemo(() => {
    let result = visibleProducts.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }
    return result;
  }, [selectedCategory, searchQuery, sortBy, visibleProducts]);

  const handleSelectVariant = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  const handleQuickAdd = (product: Product) => {
    const variantIndex = selectedVariants[product.id] || 0;
    const variant = product.variants[variantIndex];
    // Retailer: use the tier price for the current quantity selection.
    let price = variant.price;
    let qty = 1;
    if (isApprovedRetailer) {
      const qtyInput = bulkQuantities[product.id] ?? 1;
      qty = Math.max(1, Number(qtyInput) || 1);
      const retailerPrice = retailerUnitPrice(product, variant.size, qty);
      if (retailerPrice !== null) price = retailerPrice;
    }
    addToCart(product, variant.size, price, qty);
  };

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {isApprovedRetailer ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-[#f2c027]" />
              <span>Wholesale Retailer Shop</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#f2c027]" />
              <span>Complete Mazooq Pantry</span>
            </div>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl text-[#00290f] font-bold tracking-tight">
            {isApprovedRetailer ? 'Wholesale Shop — Tier Pricing Active' : 'Explore All 20 Gourmet SKUs'}
          </h1>
          <p className="text-sm sm:text-base text-[#414941]">
            {isApprovedRetailer
              ? 'Prices below reflect your retailer tier. Add more units to unlock deeper discounts automatically.'
              : 'Heritage tea, whole royal dates, slow-roasted nuts, authentic Kerala plantain crisps, and pure ground spices.'}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="mt-10 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#ebefe6] space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#717970]" />
              <input
                type="text"
                placeholder="Search products or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#f1f5eb] border border-[#dfe4da] rounded-xl text-xs focus:outline-none focus:border-[#765b00]"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-[#717970] whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#f1f5eb] border border-[#dfe4da] rounded-xl px-3 py-2 text-xs font-medium text-[#181d17] focus:outline-none focus:border-[#765b00]"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ebefe6]">
            {[
              { id: 'all', label: `All Products (${visibleProducts.length})` },
              { id: 'tea', label: 'Tea' },
              { id: 'dates', label: 'Dates' },
              { id: 'nuts', label: 'Nuts & Dry Fruits' },
              { id: 'snacks', label: 'Snacks' },
              { id: 'spices', label: 'Spices' },
            ].map((tab) => {
              const count = tab.id === 'all'
                ? visibleProducts.length
                : visibleProducts.filter((p) => p.category === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setShopCategory(tab.id);
                    setShopCategory(tab.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#00290f] text-white shadow-sm'
                      : 'bg-[#f1f5eb] text-[#414941] hover:bg-[#dfe4da]'
                  }`}
                >
                  {tab.label}{tab.id !== 'all' ? ` (${count})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#ebefe6] space-y-3">
            <Search className="w-10 h-10 text-[#717970]/40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#00290f]">No products matched your search</h3>
            <p className="text-xs text-[#717970]">Try clearing search keywords or switching categories.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShopCategory('all');
              }}
              className="mt-2 px-5 py-2 bg-[#00290f] text-white text-xs font-semibold uppercase rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const activeVariantIdx = selectedVariants[product.id] || 0;
              const activeVariant = product.variants[activeVariantIdx] || product.variants[0];
              const bulkQty = isApprovedRetailer
                ? Math.max(1, Number(bulkQuantities[product.id] ?? 1))
                : 1;
              const retailerPrice = isApprovedRetailer
                ? retailerUnitPrice(product, activeVariant.size, bulkQty)
                : null;
              const displayPrice = isApprovedRetailer && retailerPrice !== null
                ? retailerPrice
                : activeVariant.price;
              const isUsingRetailerPrice = isApprovedRetailer && retailerPrice !== null && retailerPrice !== activeVariant.price;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border ${
                    isApprovedRetailer ? 'border-[#f2c027]/40' : 'border-[#ebefe6]'
                  } group`}
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-52 bg-[#ebefe6] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-4">
                      {product.tag && (
                        <span className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-[#f2c027] text-[#181d17] rounded text-[10px] font-bold uppercase tracking-wider shadow whitespace-nowrap">
                          {product.tag}
                        </span>
                      )}
                      {isApprovedRetailer && (
                        <span className="absolute top-2 right-2 z-10 px-2.5 py-1 bg-[#104020] text-[#ffdf93] rounded text-[10px] font-bold uppercase tracking-wider shadow flex items-center gap-1 whitespace-nowrap">
                          <Tag className="w-3 h-3" />
                          Wholesale
                        </span>
                      )}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute bottom-2 right-2 z-10 p-1.5 bg-white/80 hover:bg-white text-[#00290f] rounded-full shadow transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <img loading="lazy" decoding="async"
                        src={product.image}
                        alt={product.name}
                        className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <span className="text-[11px] uppercase font-bold text-[#765b00] tracking-widest block">
                      {product.categoryLabel}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#00290f] mt-1 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#414941] mt-1 line-clamp-2">
                      {product.subtitle}
                    </p>

                    {/* Retailer tier table (approved retailers only) */}
                    {isApprovedRetailer && retailerTiersForSize(product, activeVariant.size).length > 0 && (
                      <div className="mt-2 p-2 bg-[#104020]/5 rounded-lg border border-[#f2c027]/20">
                        <div className="text-[10px] uppercase font-bold text-[#765b00] tracking-wider flex items-center gap-1 mb-1">
                          <TrendingDown className="w-3 h-3" />
                          Wholesale Tiers ({activeVariant.size})
                        </div>
                        <div className="space-y-0.5 text-[10px] text-[#414941]">
                          {retailerTiersForSize(product, activeVariant.size).map((t, i) => {
                            const inTier = bulkQty >= t.minQty && (t.maxQty === null || t.maxQty === undefined || bulkQty <= t.maxQty);
                            return (
                              <div key={i} className={`flex justify-between ${inTier ? 'font-bold text-[#104020]' : ''}`}>
                                <span>
                                  {t.maxQty == null ? `${t.minQty}+` : `${t.minQty}-${t.maxQty}`} units
                                  {inTier && ' ✓'}
                                </span>
                                <span>₹{t.pricePerUnit}/unit</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing and Variant Selector */}
                  <div className="mt-4 pt-3 border-t border-[#ebefe6]">
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {product.variants.map((variant, idx) => (
                        <button
                          key={variant.size}
                          onClick={() => handleSelectVariant(product.id, idx)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                            activeVariantIdx === idx
                              ? 'bg-[#00290f] text-white shadow-sm'
                              : 'bg-[#f1f5eb] text-[#414941] hover:bg-[#dfe4da]'
                          }`}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>

                    {/* Bulk quantity input for approved retailers */}
                    {isApprovedRetailer && (
                      <div className="mb-3 flex items-center gap-2 text-xs">
                        <label className="text-[#717970] uppercase font-semibold text-[10px] tracking-wider">Qty:</label>
                        <input
                          type="number"
                          min={1}
                          value={bulkQty}
                          onChange={(e) => setBulkQuantities({ ...bulkQuantities, [product.id]: Number(e.target.value) || 1 })}
                          className="w-16 px-2 py-1 border border-[#dfe4da] rounded text-xs focus:outline-none focus:border-[#765b00]"
                        />
                        <span className="text-[10px] text-[#717970]">
                          = ₹{(displayPrice * bulkQty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-serif text-lg font-bold ${isUsingRetailerPrice ? 'text-[#104020]' : 'text-[#00290f]'}`}>
                          ₹{displayPrice}
                        </span>
                        {isUsingRetailerPrice && (
                          <span className="ml-1 text-[10px] line-through text-[#717970]">
                            ₹{activeVariant.price}
                          </span>
                        )}
                        <span className="block text-[10px] text-[#717970]">
                          {isUsingRetailerPrice ? 'Retailer tier price' : 'Taxes included'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="px-3.5 py-2 bg-[#00290f] text-[#ffdf93] hover:bg-[#104020] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add{isApprovedRetailer ? ` ×${bulkQty}` : ''}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
