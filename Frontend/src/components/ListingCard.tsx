import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle2 } from "lucide-react";

export function ListingCard({
  listing,
  onAddToCart,
  isInCart,
  showCartButton = true,
}: any) {
  return (
    <Card className="overflow-hidden">
      {/* IMAGE */}
      <div className="h-48 bg-secondary">
        <img
          src={listing.imageUrl}
          alt={listing.predictedGrain}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-bold capitalize">
          {listing.predictedGrain}
        </h3>

        <p className="text-sm text-muted-foreground">{listing.location}</p>

        <Badge variant="outline">
          {listing.qualityGrade} • {listing.confidenceScore}%
        </Badge>

        <p className="text-sm mt-2">{listing.qualityExplanation}</p>
      </CardContent>

      <CardFooter className="flex justify-between p-4">
        <div>
          <p className="text-xl font-bold">₹{listing.pricePerQuintal}</p>
          <p className="text-xs text-muted-foreground">per quintal</p>
        </div>

        {showCartButton && (
          isInCart ? (
            <Button size="sm" disabled>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              In Cart
            </Button>
          ) : (
            <Button size="sm" onClick={() => onAddToCart(listing)}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
