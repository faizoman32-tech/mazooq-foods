// src/data/company.ts
// Brand-level constants for Mazooq Foods.
//
// All values here are derived from real project sources:
//   - Phone/email/addresses: index.html (structured data, JSON-LD Organization schema)
//   - FSSAI license numbers: src/components/Footer.tsx + src/views/ContactView.tsx
//   - Hub names + focus: src/views/OurStoryView.tsx + src/views/ContactView.tsx
//
// Do NOT introduce synthetic values here. If you change something, update
// the matching references in index.html, Footer.tsx, ContactView.tsx, and
// OurStoryView.tsx too.

export interface Facility {
  title: string;
  address: string;
  focus: string;
  fssai: string;
}

export interface GlobalPort {
  port: string;
  region: string;
  country: string;
  route: string;
  status: string;
  leadTime: string;
  compliance: string[];
}

export const COMPANY = {
  name: 'Mazooq Foods Private Limited',
  tagline: 'Taste the smile',
  email: 'info@mazooq.com',
  phones: ['+91 70021 70175', '+91 91019 91467'],
  /** WhatsApp chat number (click-to-chat button, contact page, order screen). */
  whatsapp: '+91 91019 91467',
  blendingHub: {
    title: 'Assam Blending & Packaging Hub',
    address: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
    focus: 'Tea sourcing, blending, and foil-sealed packaging',
    fssai: '10326002000025',
  } satisfies Facility,
  corporateOffice: {
    title: 'Kerala Snacks & Spices Facility',
    address: 'CHETTITHODI, 10/393 D, Nellaya, Ottappalam, Palakkad - 679335',
    focus: 'Banana chips, nuts roasting, spice grinding',
    fssai: '11325009001048',
  } satisfies Facility,
  globalPorts: [
    {
      port: 'Jebel Ali',
      region: 'Middle East',
      country: 'United Arab Emirates',
      route: 'Mumbai → Jebel Ali (Direct)',
      status: 'Active Corridor',
      leadTime: '12-15 days',
      compliance: ['FSSAI Export Certificate', 'Halal Certified', 'GCC Labeling'],
    },
    {
      port: 'Felixstowe',
      region: 'United Kingdom',
      country: 'United Kingdom',
      route: 'Mumbai → Felixstowe (Via Suez)',
      status: 'Active Corridor',
      leadTime: '28-32 days',
      compliance: ['EU Phytosanitary', 'UKCA Labeling', 'Organic Certified (selected SKUs)'],
    },
    {
      port: 'Rotterdam',
      region: 'European Union',
      country: 'European Union',
      route: 'Mumbai → Rotterdam (Via Suez)',
      status: 'Active Corridor',
      leadTime: '25-30 days',
      compliance: ['EU Phytosanitary', 'EU 1169/2011 Labeling', 'Organic Certified (selected SKUs)'],
    },
    {
      port: 'Newark',
      region: 'North America',
      country: 'United States',
      route: 'Mumbai → Newark (Via Suez)',
      status: 'Active Corridor',
      leadTime: '35-40 days',
      compliance: ['FDA Prior Notice', 'FCE/SID Registration', 'USDA Organic (selected SKUs)'],
    },
  ] satisfies GlobalPort[],
} as const;

/** wa.me click-to-chat link for the Mazooq WhatsApp number, with an optional pre-filled message. */
export function whatsappLink(message?: string): string {
  const digits = COMPANY.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
