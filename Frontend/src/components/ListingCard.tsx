import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QualityBadge } from '@/components/QualityBadge';
import { TrustScore } from '@/components/TrustScore';
import { GrainListing, GrainType } from '@/types';
import { MapPin, Package, CheckCircle2, ShoppingCart, Check } from 'lucide-react';

interface ListingCardProps {
  listing: GrainListing;
  onViewDetails?: (listingId: string) => void;
  onAddToCart?: (listing: GrainListing) => void;
  isInCart?: boolean;
  showCartButton?: boolean;
}

const grainEmojis: Record<GrainType, string> = {
  wheat: '🌾',
  rice: '🍚',
  corn: '🌽',
  barley: '🌿',
  soybean: '🫘',
  millet: '🌱',
};

export function ListingCard({ listing, onViewDetails, onAddToCart, isInCart, showCartButton = true }: ListingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-soft-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 bg-secondary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {grainEmojis[listing.grainType]}
        </div>
        {/* TODO: Azure Blob Storage will host actual grain images */}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <QualityBadge grade={listing.qualityGrade} confidenceScore={listing.confidenceScore} size="sm" />
        </div>
        
        {listing.verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="gap-1 bg-card/90 text-foreground backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3 text-grade-a" />
              Verified
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif font-semibold text-lg capitalize">{listing.grainType}</h3>
            <p className="text-sm text-muted-foreground">{listing.sellerName}</p>
          </div>
          <TrustScore score={listing.trustScore} showLabel={false} />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{listing.quantity} qtl</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {listing.qualityExplanation}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-primary">₹{listing.pricePerQuintal.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">per quintal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails?.(listing.id)}>
            Details
          </Button>
          {showCartButton && (
            isInCart ? (
              <Button variant="secondary" size="sm" className="gap-1" disabled>
                <Check className="h-4 w-4" />
                In Cart
              </Button>
            ) : (
              <Button variant="success" size="sm" className="gap-1" onClick={() => onAddToCart?.(listing)}>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
