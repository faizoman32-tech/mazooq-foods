export interface CompanyInfo {
  legalName: string;
  brandName: string;
  slogan: string;
  tagline: string;
  founder: string;
  incorporationDate: string;
  status: string;
  phones: string[];
  email: string;
  website: string;
  blendingHub: {
    title: string;
    location: string;
    address: string;
    fssai: string;
    focus: string;
  };
  corporateOffice: {
    title: string;
    location: string;
    address: string;
    fssai: string;
    focus: string;
  };
  globalPorts: Array<{
    country: string;
    port: string;
    region: string;
    status: 'Operational' | 'Active Pipeline' | 'Planned Q3 2026';
    leadTime: string;
  }>;
}

export const COMPANY: CompanyInfo = {
  legalName: 'Mazooq Foods Private Limited',
  brandName: 'Mazooq Foods',
  slogan: 'Taste the smile',
  tagline: 'Pure Taste • Built with Trust',
  founder: 'Naseef Hudawi',
  incorporationDate: 'November 2025',
  status: 'Active Private Limited Company',
  phones: ['+91 70021 70175', '+91 91019 91467'],
  email: 'info@mazooq.com',
  website: 'www.mazooq.com',
  blendingHub: {
    title: 'Assam Tea Blending & Packaging Works',
    location: 'Guwahati, Assam',
    address: 'Amingaon, Guwahati, Kamrup District, Assam - 781031, India',
    fssai: '10326002000025',
    focus: '100% Single-Garden Assam CTC & Orthodox Leaf Processing, Vacuum Barrier Seal packaging',
  },
  corporateOffice: {
    title: 'Corporate Headquarters & Southern Logistics',
    location: 'Palakkad, Kerala',
    address: 'CHETTITHODI, 10/393 D, Nellaya, Ottappalam, Palakkad Dist., Kerala - 679335, India',
    fssai: '11325009001048',
    focus: 'Brand Management, B2B Distribution, Dry Fruits, Snacks, Dates, and International Trade',
  },
  globalPorts: [
    {
      country: 'United Arab Emirates',
      port: 'Jebel Ali, Dubai',
      region: 'Middle East / GCC',
      status: 'Operational',
      leadTime: '7-9 Days Sea Transit',
    },
    {
      country: 'Saudi Arabia',
      port: 'Jeddah Islamic Port',
      region: 'Middle East',
      status: 'Operational',
      leadTime: '10-12 Days Sea Transit',
    },
    {
      country: 'United Kingdom',
      port: 'London Gateway & Felixstowe',
      region: 'Europe',
      status: 'Active Pipeline',
      leadTime: '18-22 Days Sea Transit',
    },
    {
      country: 'United States',
      port: 'Port of New York / New Jersey',
      region: 'North America',
      status: 'Active Pipeline',
      leadTime: '24-28 Days Sea Transit',
    },
    {
      country: 'Singapore',
      port: 'Port of Singapore',
      region: 'Southeast Asia',
      status: 'Planned Q3 2026',
      leadTime: '5-7 Days Sea Transit',
    },
  ],
};
