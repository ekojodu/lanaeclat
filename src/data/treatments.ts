export interface Treatment {
  id: string;
  name: string;
  description: string;
  duration: string;
  emoji: string;
  highlight?: string;
}

export const treatments: Treatment[] = [
  {
    id: 'deep-cleansing',
    name: 'Deep Cleansing Facial',
    description: 'Removes dirt, unclogs pores & refreshes tired skin for a clean, radiant complexion.',
    duration: '60 min',
    emoji: '🌸',
    highlight: 'Most Popular',
  },
  {
    id: 'hydrating',
    name: 'Hydrating Facial',
    description: 'Restores moisture for soft, plump, glowing skin that lasts all week.',
    duration: '75 min',
    emoji: '💧',
  },
  {
    id: 'glow',
    name: 'Glow Facial',
    description: 'Instant radiance for dull and stressed skin. Walk in tired, walk out luminous.',
    duration: '60 min',
    emoji: '✨',
    highlight: 'Fan Favourite',
  },
  {
    id: 'acne',
    name: 'Acne Treatment Facial',
    description: 'Targets breakouts, calms inflammation & improves texture for clearer skin.',
    duration: '90 min',
    emoji: '🌿',
  },
  {
    id: 'dark-spot',
    name: 'Dark Spot & Hyperpigmentation Facial',
    description: 'Evens skin tone and brightens complexion for a visibly more uniform, radiant face.',
    duration: '90 min',
    emoji: '🌙',
  },
  {
    id: 'anti-aging',
    name: 'Anti-Aging Facial',
    description: 'Firms skin, reduces fine lines & boosts collagen for a youthful, refreshed look.',
    duration: '90 min',
    emoji: '⏳',
    highlight: 'Premium',
  },
  {
    id: 'sensitive',
    name: 'Sensitive Skin Facial',
    description: 'Gentle care for delicate and reactive skin using calming, fragrance-free formulas.',
    duration: '60 min',
    emoji: '🕊️',
  },
];
