import { useState } from "react";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { GrainType, QualityGrade, GrainListing } from "@/types";
import { Filter, Search, Package, Shield, X } from "lucide-react";

export default function Marketplace() {
  const { listings, userRole, addToCart, cart } = useApp();
  const { toast } = useToast();

  const [grainFilter, setGrainFilter] = useState<GrainType | "all">("all");
  const [gradeFilter, setGradeFilter] = useState<QualityGrade | "all">("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  // ✅ BACKEND uses status, not verified
  const verifiedListings = listings.filter(
    (l: any) => l.status === "VERIFIED"
  );

  const filteredListings = verifiedListings.filter((listing: any) => {
    if (grainFilter !== "all" && listing.predictedGrain !== grainFilter)
      return false;
    if (
      gradeFilter !== "all" &&
      listing.qualityGrade !== `Grade_${gradeFilter}`
    )
      return false;
    if (
      listing.pricePerQuintal < priceRange[0] ||
      listing.pricePerQuintal > priceRange[1]
    )
      return false;
    return true;
  });

  const handleAddToCart = (listing: GrainListing) => {
    addToCart(listing);
    toast({
      title: "Added to Cart",
      description: `${listing.predictedGrain} added to your cart`,
    });
  };

  const isInCart = (listingId: string) =>
    cart.some((item) => item.listingId === listingId);

  const clearFilters = () => {
    setGrainFilter("all");
    setGradeFilter("all");
    setPriceRange([0, 10000]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Buy Grains</h1>
            <p className="text-muted-foreground">
              {filteredListings.length} AI-verified listings
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-4 grid grid-cols-3 gap-4">
              <Select value={grainFilter} onValueChange={(v) => setGrainFilter(v as any)}>
                <SelectTrigger><SelectValue placeholder="Grain" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v as any)}>
                <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <label className="text-sm">Price Range</label>
                <Slider
                  value={priceRange}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={setPriceRange}
                />
              </div>

              <Button variant="ghost" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Listings */}
        {filteredListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing: any) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onAddToCart={handleAddToCart}
                isInCart={isInCart(listing._id)}
                showCartButton={userRole === "buyer"}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p>No verified listings available</p>
          </Card>
        )}

        <div className="text-center text-sm text-muted-foreground pt-6 flex justify-center gap-2">
          <Shield className="h-4 w-4" />
          All listings are AI-verified
        </div>
      </main>
    </div>
  );
}
