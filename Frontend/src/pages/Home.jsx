import { Header } from '@/components/Header';
import { MarketPriceCard } from '@/components/MarketPriceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MARKET_PRICES } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Info, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const { userRole, user } = useApp();
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigates based on the role stored in Azure/Context
    if (userRole === 'seller') {
      navigate('/');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-primary/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-primary/20">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h2>
            <p className="text-muted-foreground">You are currently logged in as a <span className="text-primary font-bold capitalize">{userRole}</span></p>
          </div>
          <Button onClick={handleContinue} className="gap-2 shrink-0">
            <LayoutDashboard className="h-4 w-4" />
            Go to {userRole === 'seller' ? 'Seller Dashboard' : 'Marketplace'}
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
            <TrendingUp className="h-4 w-4" />
            Live Market Insights
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Today's Grain Prices</h1>
        </div>

        {/* Price Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {MARKET_PRICES.map((price) => (
            <MarketPriceCard key={price.grainType} price={price} />
          ))}
        </div>

        {/* Info & Trust Section */}
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex gap-4">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Prices are updated daily based on national agricultural commodity exchanges.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4 flex gap-4">
              <Shield className="h-5 w-5 text-accent-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                SastaSauda AI ensures quality verification for every transaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}