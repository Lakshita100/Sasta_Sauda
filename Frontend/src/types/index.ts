export type UserRole = 'seller' | 'buyer' | null;

export type GrainType = 'wheat' | 'rice' | 'corn' | 'barley' | 'soybean' | 'millet';

export type QualityGrade = 'A' | 'B' | 'C';

export interface GrainListing {
  id: string;
  grainType: GrainType;
  quantity: number;
  pricePerQuintal: number;
  location: string;
  sellerId: string;
  sellerName: string;
  images: string[];
  qualityGrade: QualityGrade;
  confidenceScore: number;
  qualityExplanation: string;
  trustScore: number;
  verified: boolean;
  createdAt: Date;
}

export interface MarketPrice {
  grainType: GrainType;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  unit: string;
}

export interface Feedback {
  listingId: string;
  buyerId: string;
  qualityMatched: boolean;
  comment?: string;
  createdAt: Date;
}

export interface VerificationResult {
  imageClarity: number;
  qualityGrade: QualityGrade;
  confidenceScore: number;
  explanation: string;
  defectsDetected: string[];
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  grainType: GrainType;
  quantity: number;
  pricePerQuintal: number;
  totalAmount: number;
  sellerName: string;
  location: string;
  qualityGrade: QualityGrade;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface CartItem {
  listingId: string;
  quantity: number;
  listing: GrainListing;
}
