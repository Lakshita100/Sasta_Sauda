import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MarketPriceCard } from "@/components/MarketPriceCard";
import { MarketPrice } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";
import { MARKET_PRICES } from "@/data/mockData";

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiDown, setApiDown] = useState(false);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/market-prices");

        if (!res.ok) {
          throw new Error("API error");
        }

        const result = await res.json();

        // Safety check
        if (!result?.data || result.data.length === 0) {
          throw new Error("Empty API data");
        }

        // ✅ Live / cached government data
        setPrices(result.data);
        setApiDown(false);
        setIsMock(false);

        console.log("Data source:", result.source);
        console.log("Last updated:", result.lastUpdated);
      } catch (error) {
        // ❌ Government API failed → use mock data
        console.error("Government API unavailable, showing mock data");
        setPrices(MARKET_PRICES);
        setApiDown(true);
        setIsMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      {/* MOCK DATA NOTE */}
      {isMock && (
        <Card className="max-w-3xl mx-auto mt-6 border-yellow-300 bg-yellow-50">
          <CardContent className="py-3 text-center text-sm text-yellow-800">
            <strong>Note:</strong> No live data was fetched from the official
            government source. The prices shown below are mock data for
            demonstration purposes only.
          </CardContent>
        </Card>
      )}

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-800">
            Today’s Market Prices
          </h1>
          <p className="text-muted-foreground">
            Verified mandi prices from official government sources
          </p>
        </div>

        {/* INFO BADGE */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="flex items-center justify-center gap-2 py-3 text-sm">
            <Shield className="h-4 w-4 text-green-600" />
            Data Source: Government of India (AGMARKNET)
          </CardContent>
        </Card>

        {/* LOADING STATE */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Fetching latest mandi prices...
          </p>
        )}

        {/* API DOWN MESSAGE */}
        {!loading && apiDown && (
          <Card className="max-w-2xl mx-auto border-yellow-300 bg-yellow-50">
            <CardContent className="p-6 text-center space-y-3">
              <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600" />
              <h2 className="text-lg font-semibold text-yellow-800">
                Official Price Service Temporarily Unavailable
              </h2>
              <p className="text-sm text-yellow-700">
                The government mandi price service is currently not responding.
                This issue is from the official data source, not from our
                platform.
              </p>
              <p className="text-xs text-yellow-700">
                Please check back later. Prices are usually updated once or
                twice daily.
              </p>
            </CardContent>
          </Card>
        )}

        {/* DATA VIEW */}
        {!loading && prices.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prices.map((price, index) => (
              <MarketPriceCard key={index} price={price} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
