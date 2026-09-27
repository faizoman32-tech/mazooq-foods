import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { COMPANY } from '../data/company';
import { Sparkles, Clock, Flame, Droplets, Star, ShoppingBag, Eye, Award, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';

export const MazooqTeaView: React.FC = () => {
  const { addToCart, setQuickViewProduct, showToast } = useCart();
  const teaProducts = PRODUCTS.filter((p) => p.category === 'tea');

  // Brewing Masterclass interactive state
  const [activeBrewMethod, setActiveBrewMethod] = useState<'milk' | 'black' | 'iced'>('milk');
  const [timerSeconds, setTimerSeconds] = useState(240); // 4 mins default
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      showToast('Brew Ready!', 'Your Mazooq Assam Tea has reached optimal liquor extraction.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, showToast]);

  const setMethod = (method: 'milk' | 'black' | 'iced') => {
    setActiveBrewMethod(method);
    setTimerRunning(false);
    if (method === 'milk') setTimerSeconds(240); // 4 mins
    if (method === 'black') setTimerSeconds(180); // 3 mins
    if (method === 'iced') setTimerSeconds(300); // 5 mins
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <div className="bg-[#00290f] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-[#ffdf93]/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#f2c027]" />
                <span>Single Origin • Brahmaputra Valley</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-tight">
                Mazooq Premium <br />
                <span className="italic font-normal text-[#ffdf93]">Assam Black Tea</span>
              </h1>
              <p className="text-base text-white/85 max-w-lg leading-relaxed">
                Selected from the world-renowned tea gardens of Assam. Blended and vacuum-packed in Amingaon, Guwahati to preserve volatile aromatics and second-flush character.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-white/60 block">Flavour Note</span>
                  <span className="font-bold text-[#ffdf93]">Malty, Bold & Brisk</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-white/60 block">Harvest</span>
                  <span className="font-bold text-[#ffdf93]">Second Flush Peak</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-white/60 block">Process</span>
                  <span className="font-bold text-[#ffdf93]">Granulated CTC & Orthodox</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAybDLrLNN8c55HFScWTh6V4bGB1COcUKEYXyI903Xxgwj0fg07uwpNVwm6YliSnBbOT7rVuqp-WIIudaf-JTy5rVvu7Zopko0NZm36F_yO-3VLad-XKZQ0I5mjsp0ZOZwfe5kmtqFjHxeJ4fNK2Vp-GBoW-41Ukc3sGuX6Ve1rfzz29M75iC0kj4PysKglL63s5Ck4KMHd60ok_7hRy41595YT9T1M200NksrIu6RySEab0EtpSbdrngG9-t3uX8isOAE"
                alt="Mazooq Gold Tea Pack Front and Back"
                className="max-h-96 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Tea Varieties Collection */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
            The Tea Pantry
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#00290f]">
            Four Distinctive Blends
          </h2>
          <p className="text-sm text-[#414941]">
            From morning golden chai to invigorating whole-spice masala brews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teaProducts.map((product) => {
            const defaultVariant = product.variants[0];
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#ebefe6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 bg-[#f1f5eb] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-4">
                    {product.tag && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#f2c027] text-[#181d17] rounded text-[10px] font-bold uppercase tracking-wider">
                        {product.tag}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-auto object-contain hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#765b00] tracking-wider block">
                    {product.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#00290f] mt-1 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#414941] mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebefe6]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-lg font-bold text-[#00290f]">
                      ₹{defaultVariant.price}{' '}
                      <span className="text-xs font-normal text-[#717970]">
                        ({defaultVariant.size})
                      </span>
                    </span>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="text-xs text-[#765b00] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, defaultVariant.size, defaultVariant.price)}
                    className="w-full py-2.5 bg-[#00290f] hover:bg-[#104020] text-[#ffdf93] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Brewing Masterclass & Live Timer */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#ebefe6]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Masterclass
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#00290f]">
                How to Brew the Perfect Mazooq Cup
              </h2>
              <p className="text-sm text-[#414941] leading-relaxed">
                Assam CTC tea contains compact granulated leaves that unfurl rapidly. Control temperature and timing to strike the ideal balance between strength, briskness, and sweetness.
              </p>

              {/* Method Selector */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setMethod('milk')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeBrewMethod === 'milk'
                      ? 'bg-[#00290f] text-[#ffdf93] shadow-md'
                      : 'bg-[#f1f5eb] text-[#414941] hover:bg-[#dfe4da]'
                  }`}
                >
                  Classic Kadak Milk Chai
                </button>
                <button
                  onClick={() => setMethod('black')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeBrewMethod === 'black'
                      ? 'bg-[#00290f] text-[#ffdf93] shadow-md'
                      : 'bg-[#f1f5eb] text-[#414941] hover:bg-[#dfe4da]'
                  }`}
                >
                  Pure Black Tea (No Milk)
                </button>
                <button
                  onClick={() => setMethod('iced')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeBrewMethod === 'iced'
                      ? 'bg-[#00290f] text-[#ffdf93] shadow-md'
                      : 'bg-[#f1f5eb] text-[#414941] hover:bg-[#dfe4da]'
                  }`}
                >
                  Summer Iced Chai
                </button>
              </div>

              {/* Step by Step Guide */}
              <div className="space-y-3 pt-2 text-xs text-[#414941]">
                {activeBrewMethod === 'milk' && (
                  <>
                    <p className="flex items-start gap-2">
                      <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Ratio:</strong> 1 cup water + 1/2 cup fresh full-cream milk + 1 heaping tsp Mazooq Tea granules.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Process:</strong> Bring water and tea to a rolling boil. Pour in milk and simmer gently on medium heat for 4 minutes until a deep caramel foam forms.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Finish:</strong> Strain into cutting glasses or porcelain cups. Add raw cane sugar or jaggery.</span>
                    </p>
                  </>
                )}
                {activeBrewMethod === 'black' && (
                  <>
                    <p className="flex items-start gap-2">
                      <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Ratio:</strong> 200ml freshly boiled water at 95°C + 1 tsp Mazooq Assam Black Tea.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Steep Time:</strong> Cover teapot and steep undisturbed for precisely 3 minutes.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Finish:</strong> Enjoy pure to admire the malt bouquet and subtle muscatel finish.</span>
                    </p>
                  </>
                )}
                {activeBrewMethod === 'iced' && (
                  <>
                    <p className="flex items-start gap-2">
                      <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Double Strength Brew:</strong> Steep 2 tsp Mazooq Tea in 150ml boiling water for 5 minutes.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Flash Chill:</strong> Pour hot concentrate over a tall glass packed with clear ice cubes to lock in clarity.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Finish:</strong> Add lemon wedge or cold condensed milk.</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Live Interactive Timer Widget */}
            <div className="lg:col-span-5 bg-[#00290f] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center border border-[#ffdf93]/20">
              <span className="text-[10px] uppercase font-bold text-[#ffdf93] tracking-widest block mb-1">
                Precision Steeping Stopwatch
              </span>
              <div className="text-5xl sm:text-6xl font-serif font-bold text-white tracking-wider my-4">
                {formatTimer(timerSeconds)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-6 py-2.5 bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(activeBrewMethod === 'milk' ? 240 : activeBrewMethod === 'black' ? 180 : 300);
                  }}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-white/60 mt-4">
                Recommended by Mazooq Master Tasters • Guwahati
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
