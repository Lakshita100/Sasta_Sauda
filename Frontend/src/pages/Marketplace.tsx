import { useState } from 'react';
import { Header } from '@/components/Header';
import { ListingCard } from '@/components/ListingCard';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { GrainType, QualityGrade, GrainListing } from '@/types';
import { GRAIN_TYPES } from '@/data/mockData';
import { Filter, Search, Package, Shield, X, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Marketplace() {
  const { listings, userRole, addToCart, cart } = useApp();
  const { toast } = useToast();
  
  // Filters
  const [grainFilter, setGrainFilter] = useState<GrainType | 'all'>('all');
  const [gradeFilter, setGradeFilter] = useState<QualityGrade | 'all'>('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialogs
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const verifiedListings = listings.filter(l => l.verified);

  const filteredListings = verifiedListings.filter(listing => {
    if (grainFilter !== 'all' && listing.grainType !== grainFilter) return false;
    if (gradeFilter !== 'all' && listing.qualityGrade !== gradeFilter) return false;
    if (listing.pricePerQuintal < priceRange[0] || listing.pricePerQuintal > priceRange[1]) return false;
    return true;
  });

  const handleAddToCart = (listing: GrainListing) => {
    addToCart(listing);
    toast({
      title: 'Added to Cart',
      description: `${listing.grainType} from ${listing.sellerName} added to your cart.`,
    });
  };

  const isInCart = (listingId: string) => {
    return cart.some(item => item.listingId === listingId);
  };

  const handleViewDetails = (listingId: string) => {
    setSelectedListingId(listingId);
    setShowDetailDialog(true);
  };

  const selectedListing = listings.find(l => l.id === selectedListingId);

  const clearFilters = () => {
    setGrainFilter('all');
    setGradeFilter('all');
    setPriceRange([0, 10000]);
  };

  const hasActiveFilters = grainFilter !== 'all' || gradeFilter !== 'all' || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-6 ">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl border bg-card p-6 shadow-sm">

          <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
 Buy Grains From Verified Sellers
</h1>
<p className="text-muted-foreground mt-2">
  {filteredListings.length} AI-verified grain listings
</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={showFilters ? 'secondary' : 'outline'} 
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 justify-center">
                  !
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Filter Listings
                </h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Grain Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grain Type</label>
                  <Select value={grainFilter} onValueChange={(v) => setGrainFilter(v as GrainType | 'all')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grains</SelectItem>
                      {GRAIN_TYPES.map(grain => (
                        <SelectItem key={grain.value} value={grain.value}>
                          {grain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality Grade Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality Grade</label>
                  <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v as QualityGrade | 'all')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="A">Grade A (Premium)</SelectItem>
                      <SelectItem value="B">Grade B (Good)</SelectItem>
                      <SelectItem value="C">Grade C (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={10000}
                    step={100}
                    onValueChange={setPriceRange}
                    className="mt-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <div 
                key={listing.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ListingCard
                  listing={listing}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  isInCart={isInCart(listing.id)}
                  showCartButton={userRole === 'buyer'}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Info Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          All listings are AI-verified for quality assurance
          {/* TODO: Azure Cosmos DB stores all verified listings */}
        </div>
      </main>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-lg">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle className="capitalize">{selectedListing.grainType} - {selectedListing.sellerName}</DialogTitle>
                <DialogDescription>
                  AI-verified listing from {selectedListing.location}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{selectedListing.quantity} quintals</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-semibold">₹{selectedListing.pricePerQuintal.toLocaleString()}/qtl</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quality Grade</p>
                    <Badge variant={`grade${selectedListing.qualityGrade}` as any}>
                      Grade {selectedListing.qualityGrade}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="font-semibold">{selectedListing.confidenceScore}%</p>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">AI Quality Assessment</p>
                  <p className="text-sm text-muted-foreground">{selectedListing.qualityExplanation}</p>
                </div>
                {userRole === 'buyer' && (
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => {
                      setShowDetailDialog(false);
                      handleAddToCart(selectedListing);
                    }}
                    disabled={isInCart(selectedListing.id)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isInCart(selectedListing.id) ? 'Already in Cart' : 'Add to Cart'}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      {selectedListingId && (
        <FeedbackDialog
          listingId={selectedListingId}
          open={showFeedbackDialog}
          onOpenChange={setShowFeedbackDialog}
        />
      )}
    </div>
  );
}
