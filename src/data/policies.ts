// src/data/policies.ts
// Legal / policy pages: Privacy, Terms, Refund & Returns, Shipping.
// Razorpay (and Google / customers) expect these to be reachable from the footer.
//
// ⚠️ REVIEW BEFORE GOING LIVE: the numbers in POLICY_SETTINGS are sensible
// defaults for a packaged-food store — change them to match how you actually
// operate. Shipping charges below mirror what checkout really charges
// (server/payments-core.js), so keep them in sync if you change those.

import { COMPANY } from './company';

export const POLICY_SETTINGS = {
  lastUpdated: '5 November 2026',
  returnWindowHours: 48,          // time to report a damaged / wrong / expired item
  refundDays: '5-7 business days', // time for the refund to reach the customer
  dispatchDays: '1-2 business days',
  deliveryDaysMetro: '3-5 business days',
  deliveryDaysOther: '5-8 business days',
  deliveryEstimate: '3-8 business days', // shown on the order-confirmed screen
  freeShippingAbove: 1500,         // customers (matches checkout)
  shippingFee: 99,
  retailerFreeShippingAbove: 5000, // approved retailers (matches checkout)
  retailerShippingFee: 199,
  jurisdiction: 'Palakkad, Kerala',
};

export type PolicyKey = 'privacy-policy' | 'terms' | 'refund-policy' | 'shipping-policy';

export interface PolicySection {
  heading: string;
  body: string[]; // paragraphs; lines starting with "• " render as bullet points
}

export interface Policy {
  title: string;
  intro: string;
  sections: PolicySection[];
}

const S = POLICY_SETTINGS;
const contactLine = `${COMPANY.email} or ${COMPANY.phones.join(' / ')}`;

export const POLICIES: Record<PolicyKey, Policy> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: `This policy explains what personal information ${COMPANY.name} ("Mazooq", "we") collects when you use this website, how we use it, and the choices you have.`,
    sections: [
      {
        heading: 'Information we collect',
        body: [
          '• Order details: your name, phone number, email, delivery address and the products you buy.',
          '• Account details: if you create a customer or retailer account, your login email, a securely hashed password, and (for retailers) business details such as business name, GSTIN and city.',
          '• Messages you send us through contact or partnership forms.',
          '• Basic usage data (pages visited, device and browser type) if analytics is enabled.',
        ],
      },
      {
        heading: 'Payments',
        body: [
          'Online payments are processed by Razorpay. Your card, UPI or bank details are entered on Razorpay’s secure checkout and are never stored on our servers. We only receive a payment reference and status.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          '• To process, ship and support your orders.',
          '• To manage your account and, for retailers, to review and approve wholesale applications.',
          '• To reply to your enquiries and send order updates.',
          '• To prevent fraud and meet legal, tax and food-safety obligations.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Sharing',
        body: [
          'We share only what is needed with the service providers that help us run the store: payment processing (Razorpay), delivery partners (name, phone and address for delivery), and hosting / database providers. We may also disclose information when required by law.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'We use a strictly necessary cookie to keep you logged in. If analytics is enabled, Google Analytics may set cookies to help us understand how the site is used.',
        ],
      },
      {
        heading: 'Data retention and your rights',
        body: [
          'We keep order records for as long as required for accounting and tax purposes. You can ask us to access, correct or delete your personal information (subject to those legal requirements) by contacting us.',
        ],
      },
      {
        heading: 'Contact',
        body: [`For any privacy question or request, contact ${contactLine}.`],
      },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    intro: `These terms apply to your use of this website and to every order placed with ${COMPANY.name}. By using the site or placing an order you agree to them.`,
    sections: [
      {
        heading: 'Products and pricing',
        body: [
          'All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. Product images are for illustration; packaging may vary slightly between batches.',
          'We may change prices or product availability at any time. The price that applies is the one shown at checkout when you place the order.',
          'If a product is listed at an obviously incorrect price due to an error, we may cancel the order and refund any amount paid in full.',
        ],
      },
      {
        heading: 'Orders and payment',
        body: [
          'An order is confirmed once payment succeeds (online) or once we accept a Cash on Delivery order. We may cancel an order if a product is out of stock, the address is undeliverable, or we suspect fraud — any amount paid is refunded in full.',
          'For Cash on Delivery, please keep the exact amount ready. Repeated refusal of COD orders may lead to COD being disabled for your account.',
        ],
      },
      {
        heading: 'Retailer (wholesale) accounts',
        body: [
          'Wholesale prices are available only to retailer accounts approved by Mazooq. Wholesale prices depend on pack size and quantity and are calculated at checkout. We may approve, decline or suspend retailer accounts at our discretion. Products bought at wholesale prices are for resale in their original sealed packaging.',
        ],
      },
      {
        heading: 'Food safety',
        body: [
          'Our products are manufactured and packed under FSSAI licences shown on this site and on the pack. Please read the ingredients and allergen information before consuming — some products contain or are processed alongside nuts. Store as directed on the pack and consume before the best-before date.',
        ],
      },
      {
        heading: 'Use of the website',
        body: [
          'You agree not to misuse the site, attempt to access other users’ accounts, or interfere with its operation. All content, logos and images on this site belong to Mazooq and may not be reused without permission.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'To the extent permitted by law, our liability for any order is limited to the amount paid for that order.',
        ],
      },
      {
        heading: 'Governing law',
        body: [
          `These terms are governed by the laws of India. Any dispute is subject to the courts of ${S.jurisdiction}.`,
        ],
      },
      {
        heading: 'Contact',
        body: [`${COMPANY.name}, ${COMPANY.corporateOffice.address}. ${contactLine}.`],
      },
    ],
  },

  'refund-policy': {
    title: 'Refund & Return Policy',
    intro: 'Because our products are food items, we cannot accept returns of opened packs or change-of-mind returns. But if anything is wrong with your order, we will make it right.',
    sections: [
      {
        heading: 'When you can get a replacement or refund',
        body: [
          '• The product arrived damaged, leaking or with a broken seal.',
          '• You received the wrong product or wrong pack size.',
          '• The product was past its best-before date on delivery.',
          '• An item was missing from your order.',
        ],
      },
      {
        heading: 'How to raise a request',
        body: [
          `Contact us within ${S.returnWindowHours} hours of delivery at ${contactLine} with your order number and clear photos of the product and packaging. We will arrange a free replacement or a full refund for the affected items — no need to send unsafe food back unless we ask.`,
        ],
      },
      {
        heading: 'Cancellations',
        body: [
          'You can cancel an order free of charge before it is dispatched — contact us as soon as possible. Once dispatched, the order cannot be cancelled, but the conditions above still apply.',
        ],
      },
      {
        heading: 'Refund timelines',
        body: [
          `Approved refunds for online payments go back to the original payment method (card, UPI, net banking) within ${S.refundDays}. For Cash on Delivery orders, we refund by UPI or bank transfer to details you provide.`,
        ],
      },
      {
        heading: 'Not eligible',
        body: [
          '• Opened or partly consumed products (except where the product itself was faulty).',
          '• Requests raised after the reporting window.',
          '• Differences in taste preference.',
        ],
      },
    ],
  },

  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    intro: 'We ship across India from our facilities in Assam and Kerala.',
    sections: [
      {
        heading: 'Shipping charges',
        body: [
          `• Customers: FREE shipping on orders of ₹${S.freeShippingAbove.toLocaleString('en-IN')} or more. A flat ₹${S.shippingFee} applies below that.`,
          `• Approved retailers: FREE shipping on orders of ₹${S.retailerFreeShippingAbove.toLocaleString('en-IN')} or more. A flat ₹${S.retailerShippingFee} applies below that.`,
          'The exact shipping charge is shown at checkout before you pay.',
        ],
      },
      {
        heading: 'Dispatch and delivery times',
        body: [
          `Orders are usually dispatched within ${S.dispatchDays}. Delivery normally takes ${S.deliveryDaysMetro} to metro cities and ${S.deliveryDaysOther} to other locations. Remote areas, holidays and courier delays can add a few days.`,
        ],
      },
      {
        heading: 'Order tracking',
        body: [
          'Once your order is dispatched we will share the courier and tracking details by SMS, WhatsApp or email. You can also contact us any time for an update.',
        ],
      },
      {
        heading: 'Delivery issues',
        body: [
          'Please check the package on delivery. If the outer box is damaged or tampered with, note it with the courier and send us photos — see our Refund & Return Policy. If a delivery fails because the address or phone number was incorrect, re-shipping charges may apply.',
        ],
      },
      {
        heading: 'International and bulk orders',
        body: [
          `Export and bulk trade orders are handled separately through our Retailer / Export team. Write to ${COMPANY.email} for quotes.`,
        ],
      },
    ],
  },
};
