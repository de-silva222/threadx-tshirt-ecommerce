/**
 * Single source of truth for brand config.
 * Swap the placeholder brand name / accent color here — nothing else
 * in the codebase hardcodes them. Runtime overrides (from the public
 * settings API) are merged on top of these defaults in App.tsx.
 */
export const brandConfig = {
  name: import.meta.env.VITE_BRAND_NAME || 'OSHRIX',
  tagline: 'Wear what defines you.',
  accentColor: '#FF4B1F',
  currency: 'LKR',
  social: {
    instagram: '',
    tiktok: '',
    facebook: '',
  },
  whatsapp: '',
  contactEmail: '',
  contactPhone: '',
}

export type BrandConfig = typeof brandConfig
