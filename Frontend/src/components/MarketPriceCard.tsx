import { Card, CardContent } from "@/components/ui/card";
import { MarketPrice } from "@/types";
import { TrendingUp, Minus } from "lucide-react";

interface Props {
  price: MarketPrice;
}

const emojiMap: Record<string, string> = {
  potato: "🥔",
  papaya: "🍈",
  pumpkin: "🎃",
  tomato: "🍅",
  banana: "🍌",
  onion: "🧅",
  wheat: "🌾",
  rice: "🍚",
  maize: "🌽",
};

export function MarketPriceCard({ price }: Props) {
  const formatPrice = (value?: number) =>
    Number.isFinite(value) ? value.toLocaleString() : "N/A";

  const trend =
    price.modalPrice >
    price.minPrice + (price.maxPrice - price.minPrice) / 2;

  const emoji =
    emojiMap[price.grainType.toLowerCase()] ?? "🌱";

  return (
    <Card className="border-green-200 hover:shadow-lg transition">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="font-semibold text-lg">
            {price.grainType}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">
          {price.mandi}, {price.state}
        </p>

        <div className="grid grid-cols-3 text-center text-sm gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Min</p>
            <p>₹{formatPrice(price.minPrice)}</p>
          </div>

          <div className="bg-green-50 rounded">
            <p className="text-xs text-green-700 font-medium">Modal</p>
            <p className="font-bold text-green-800">
              ₹{formatPrice(price.modalPrice)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Max</p>
            <p>₹{formatPrice(price.maxPrice)}</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
          {trend ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          <span>per quintal</span>
        </div>
      </CardContent>
    </Card>
  );
}
