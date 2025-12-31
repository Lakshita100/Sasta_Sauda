import { Header } from '@/components/Header';
import { MarketPriceCard } from '@/components/MarketPriceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MARKET_PRICES } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Info, ArrowRight } from 'lucide-react';

export default function MarketPrices() {
  const { userRole } = useApp();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (userRole === 'seller') {
      navigate('/seller');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
            <TrendingUp className="h-4 w-4" />
            Live Market Data
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Today's Grain Market Prices
          </h1>
          <p className="text-muted-foreground">
            Real-time market prices to help you make informed trading decisions
          </p>
        </div>

        {/* Info Card */}
        <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20 animate-slide-up">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Why we show market prices</p>
              <p className="text-sm text-muted-foreground">
                Transparent pricing reduces market manipulation and helps both sellers and buyers 
                negotiate fair prices based on current market conditions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Price Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {MARKET_PRICES.map((price, index) => (
            <div 
              key={price.grainType} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MarketPriceCard price={price} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 pt-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>All prices verified and updated daily</span>
          </div>
          <Button size="lg" onClick={handleContinue} className="gap-2">
            {userRole === 'seller' ? 'List Your Grain' : 'Browse Marketplace'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
          {/* TODO: Azure Cosmos DB will store and update market prices in real-time */}
          Market prices are indicative and sourced from major agricultural commodity exchanges. 
          Actual transaction prices may vary based on quality, location, and quantity.
        </p>
      </main>
    </div>
  );
}
