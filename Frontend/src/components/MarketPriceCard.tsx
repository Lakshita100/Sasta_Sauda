import { Card, CardContent } from '@/components/ui/card';
import { MarketPrice, GrainType } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketPriceCardProps {
  price: MarketPrice;
  isHighlighted?: boolean;
}

const grainEmojis: Record<GrainType, string> = {
  wheat: '🌾',
  rice: '🍚',
  corn: '🌽',
  barley: '🌿',
  soybean: '🫘',
  millet: '🌱',
};

export function MarketPriceCard({ price, isHighlighted = false }: MarketPriceCardProps) {
  const avgTrend = price.avgPrice > price.minPrice + (price.maxPrice - price.minPrice) / 2;
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-soft-lg ${isHighlighted ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2">
          <span className="text-2xl">{grainEmojis[price.grainType]}</span>
          <h3 className="font-serif font-semibold capitalize text-lg">{price.grainType}</h3>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Min</p>
              <p className="font-semibold text-muted-foreground">₹{price.minPrice.toLocaleString()}</p>
            </div>
            <div className="space-y-1 bg-primary/10 rounded-lg py-2 -my-1">
              <p className="text-xs text-primary uppercase tracking-wide font-medium">Avg</p>
              <p className="font-bold text-primary text-lg">₹{price.avgPrice.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Max</p>
              <p className="font-semibold text-muted-foreground">₹{price.maxPrice.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-2 border-t">
            {avgTrend ? (
              <TrendingUp className="h-3 w-3 text-grade-a" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            <span>per quintal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
