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
    id: 'hydrating',
    name: 'Hydrating Facial',
    description: 'Designed for first-time clients and sensitive skin. Restores moisture and strengthens the skin barrier.',
    duration: '45 mins',
    emoji: '💧',
    highlight: 'Starter Facial',
  },
  {
    id: 'sensitive',
    name: 'Sensitive / Calming Facial',
    description: 'Soothes redness, irritation, and stressed skin while restoring balance and comfort.',
    duration: '45 mins',
    emoji: '🕊️',
  },
  {
    id: 'exfoliating',
    name: 'Exfoliating Facial',
    description: 'Deep yet gentle exfoliation to remove dead skin cells, refine texture, and promote skin renewal.',
    duration: '45 mins',
    emoji: '✦',
  },
  {
    id: 'acne-control',
    name: 'Acne Control Facial',
    description: 'Targets active breakouts and congestion while calming inflamed skin.',
    duration: '50 mins',
    emoji: '🌿',
  },
  {
    id: 'acne-blackhead',
    name: 'Acne Facial with Blackhead Removal',
    description: 'Acne-focused treatment combined with careful blackhead extraction to unclog pores and improve skin clarity.',
    duration: '60 mins',
    emoji: '🌊',
  },
  {
    id: 'brightening',
    name: 'Brightening Facial',
    description: 'Enhances natural glow, improves dullness, and evens skin tone using brightening actives including Vitamin C.',
    duration: '50 mins',
    emoji: '✨',
    highlight: 'Fan Favourite',
  },
  {
    id: 'anti-aging',
    name: 'Anti-Ageing Facial',
    description: 'Advanced treatment designed to reduce the appearance of fine lines and wrinkles, improve skin firmness, and promote a youthful, radiant complexion.',
    duration: '60 mins',
    emoji: '⏳',
    highlight: 'Premium',
  },
];
