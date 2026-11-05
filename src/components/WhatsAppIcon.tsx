import React from 'react';

/** Your WhatsApp icon file (public/photos). Used for every WhatsApp link on the site. */
export const WHATSAPP_ICON_SRC = '/photos/Whatsapp_Icon.avif';

/**
 * WhatsApp icon shown as a small round white badge (the image has a light
 * background, so a white circle keeps it looking tidy on green buttons).
 */
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white overflow-hidden ${className}`}>
    <img src={WHATSAPP_ICON_SRC} alt="" aria-hidden="true" className="w-full h-full object-cover scale-[1.12]" />
  </span>
);

/**
 * Same WhatsApp icon pre-coloured gold with a transparent background
 * (public/photos/whatsapp-icon-gold*.png, made from Whatsapp_Icon.avif),
 * to sit alongside the gold outline icons in the footer and Contact card.
 */
export const WhatsAppIconTinted: React.FC<{ className?: string; tone?: 'gold' | 'light' }> = ({
  className = 'w-4 h-4',
  tone = 'gold',
}) => (
  <img
    src={tone === 'light' ? '/photos/whatsapp-icon-gold-light.png' : '/photos/whatsapp-icon-gold.png'}
    alt=""
    aria-hidden="true"
    className={`shrink-0 object-contain ${className}`}
  />
);
