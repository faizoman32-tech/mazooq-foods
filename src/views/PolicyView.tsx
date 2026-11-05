import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { POLICIES, POLICY_SETTINGS, PolicyKey } from '../data/policies';
import { useCart } from '../context/CartContext';

const POLICY_LINKS: { key: PolicyKey; label: string }[] = [
  { key: 'privacy-policy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'refund-policy', label: 'Refund & Returns' },
  { key: 'shipping-policy', label: 'Shipping & Delivery' },
];

export const PolicyView: React.FC<{ policy: PolicyKey }> = ({ policy }) => {
  const { setActivePage } = useCart();
  const doc = POLICIES[policy];

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      <section className="max-w-3xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-[#f2c027]" />
          <span>Policies</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#00290f] font-bold tracking-tight mt-4">
          {doc.title}
        </h1>
        <p className="text-xs text-[#717970] mt-2">Last updated: {POLICY_SETTINGS.lastUpdated}</p>

        <nav className="flex flex-wrap gap-2 mt-6" aria-label="Policy pages">
          {POLICY_LINKS.map((l) => (
            <button
              key={l.key}
              onClick={() => setActivePage(l.key)}
              aria-current={l.key === policy ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                l.key === policy
                  ? 'bg-[#00290f] text-white'
                  : 'bg-[#ebefe6] text-[#414941] hover:bg-[#dfe4da]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <p className="text-base text-[#414941] leading-relaxed mt-8">{doc.intro}</p>

        <div className="mt-8 space-y-8">
          {doc.sections.map((section) => {
            const bullets = section.body.filter((p) => p.startsWith('• '));
            const paras = section.body.filter((p) => !p.startsWith('• '));
            return (
              <section key={section.heading}>
                <h2 className="font-serif text-xl font-bold text-[#00290f] mb-3">{section.heading}</h2>
                {bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#414941] leading-relaxed mb-3">
                    {bullets.map((b) => (
                      <li key={b}>{b.slice(2)}</li>
                    ))}
                  </ul>
                )}
                {paras.map((p) => (
                  <p key={p} className="text-sm text-[#414941] leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
};
