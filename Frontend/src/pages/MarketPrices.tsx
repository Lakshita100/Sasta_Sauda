import { Header } from "@/components/Header";
import { MarketPriceCard } from "@/components/MarketPriceCard";
import { Card, CardContent } from "@/components/ui/card";
import { MARKET_PRICES } from "@/data/mockData";
import { Shield } from "lucide-react";

export default function MarketPrices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />
      <div className="h-6" />

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-serif font-bold text-green-800">
            Today’s Market Prices
          </h1>
          <p className="text-muted-foreground">
            Live prices from major agricultural markets
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-white/80 border-green-200">
          <CardContent className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-600" />
            Prices updated daily for transparency
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKET_PRICES.map((price) => (
            <MarketPriceCard key={price.grainType} price={price} />
          ))}
        </div>
      </main>
    </div>
  );
}
