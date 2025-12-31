import { GrainListing, MarketPrice, GrainType, QualityGrade } from '@/types';

export const GRAIN_TYPES: { value: GrainType; label: string }[] = [
  { value: 'wheat', label: 'Wheat' },
  { value: 'rice', label: 'Rice' },
  { value: 'corn', label: 'Corn' },
  { value: 'barley', label: 'Barley' },
  { value: 'soybean', label: 'Soybean' },
  { value: 'millet', label: 'Millet' },
];

export const MARKET_PRICES: MarketPrice[] = [
  { grainType: 'wheat', minPrice: 2100, avgPrice: 2350, maxPrice: 2600, unit: '₹/quintal' },
  { grainType: 'rice', minPrice: 2800, avgPrice: 3100, maxPrice: 3400, unit: '₹/quintal' },
  { grainType: 'corn', minPrice: 1800, avgPrice: 2050, maxPrice: 2300, unit: '₹/quintal' },
  { grainType: 'barley', minPrice: 1600, avgPrice: 1850, maxPrice: 2100, unit: '₹/quintal' },
  { grainType: 'soybean', minPrice: 4200, avgPrice: 4600, maxPrice: 5000, unit: '₹/quintal' },
  { grainType: 'millet', minPrice: 2200, avgPrice: 2450, maxPrice: 2700, unit: '₹/quintal' },
];

export const MOCK_LISTINGS: GrainListing[] = [
  {
    id: '1',
    grainType: 'wheat',
    quantity: 150,
    pricePerQuintal: 2400,
    location: 'Punjab, India',
    sellerId: 'seller-1',
    sellerName: 'Rajesh Kumar',
    images: ['/placeholder.svg'],
    qualityGrade: 'A',
    confidenceScore: 94,
    qualityExplanation: 'Premium quality wheat with excellent grain structure and minimal impurities.',
    trustScore: 92,
    verified: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    grainType: 'rice',
    quantity: 200,
    pricePerQuintal: 3200,
    location: 'Haryana, India',
    sellerId: 'seller-2',
    sellerName: 'Priya Singh',
    images: ['/placeholder.svg'],
    qualityGrade: 'A',
    confidenceScore: 91,
    qualityExplanation: 'High-quality basmati rice with long grains and aromatic properties.',
    trustScore: 88,
    verified: true,
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    grainType: 'corn',
    quantity: 100,
    pricePerQuintal: 2100,
    location: 'Maharashtra, India',
    sellerId: 'seller-3',
    sellerName: 'Amit Patel',
    images: ['/placeholder.svg'],
    qualityGrade: 'B',
    confidenceScore: 82,
    qualityExplanation: 'Good quality corn with minor moisture variation. Suitable for industrial use.',
    trustScore: 75,
    verified: true,
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    grainType: 'soybean',
    quantity: 80,
    pricePerQuintal: 4700,
    location: 'Madhya Pradesh, India',
    sellerId: 'seller-4',
    sellerName: 'Sunita Verma',
    images: ['/placeholder.svg'],
    qualityGrade: 'A',
    confidenceScore: 96,
    qualityExplanation: 'Exceptional soybean quality with high protein content and uniform size.',
    trustScore: 95,
    verified: true,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    grainType: 'barley',
    quantity: 120,
    pricePerQuintal: 1900,
    location: 'Rajasthan, India',
    sellerId: 'seller-5',
    sellerName: 'Vikram Sharma',
    images: ['/placeholder.svg'],
    qualityGrade: 'B',
    confidenceScore: 78,
    qualityExplanation: 'Standard barley quality with acceptable moisture levels.',
    trustScore: 70,
    verified: true,
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '6',
    grainType: 'millet',
    quantity: 90,
    pricePerQuintal: 2500,
    location: 'Karnataka, India',
    sellerId: 'seller-6',
    sellerName: 'Lakshmi Reddy',
    images: ['/placeholder.svg'],
    qualityGrade: 'A',
    confidenceScore: 89,
    qualityExplanation: 'Organic millet with excellent nutritional profile.',
    trustScore: 85,
    verified: true,
    createdAt: new Date('2024-01-10'),
  },
];

export const LOCATIONS = [
  'Punjab, India',
  'Haryana, India',
  'Maharashtra, India',
  'Madhya Pradesh, India',
  'Rajasthan, India',
  'Karnataka, India',
  'Uttar Pradesh, India',
  'Gujarat, India',
];

export function getGradeColor(grade: QualityGrade): string {
  switch (grade) {
    case 'A':
      return 'bg-grade-a';
    case 'B':
      return 'bg-grade-b';
    case 'C':
      return 'bg-grade-c';
  }
}

export function getGradeTextColor(grade: QualityGrade): string {
  switch (grade) {
    case 'A':
      return 'text-grade-a';
    case 'B':
      return 'text-grade-b';
    case 'C':
      return 'text-grade-c';
  }
}

export function getTrustColor(score: number): string {
  if (score >= 80) return 'text-trust-high';
  if (score >= 60) return 'text-trust-medium';
  return 'text-trust-low';
}
