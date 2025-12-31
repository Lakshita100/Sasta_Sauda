import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIVerification } from '@/components/AIVerification';
import { GRAIN_TYPES, LOCATIONS, MARKET_PRICES } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GrainType, VerificationResult } from '@/types';
import { Upload, Wheat, MapPin, Scale, IndianRupee, CheckCircle2 } from 'lucide-react';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { addListing, currentUser } = useApp();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'form' | 'verification' | 'complete'>('form');
  const [formData, setFormData] = useState({
    grainType: '' as GrainType | '',
    quantity: '',
    price: '',
    location: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmitForVerification = () => {
    if (!formData.grainType || !formData.quantity || !formData.price || !formData.location || images.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields and upload at least one image.',
        variant: 'destructive',
      });
      return;
    }
    setStep('verification');
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    setVerificationResult(result);
    
    // Create the listing
    const newListing = {
      id: `listing-${Date.now()}`,
      grainType: formData.grainType as GrainType,
      quantity: parseInt(formData.quantity),
      pricePerQuintal: parseInt(formData.price),
      location: formData.location,
      sellerId: currentUser?.id || 'seller-demo',
      sellerName: currentUser?.name || 'Demo Seller',
      images: ['/placeholder.svg'], // TODO: Azure Blob Storage URLs
      qualityGrade: result.qualityGrade,
      confidenceScore: result.confidenceScore,
      qualityExplanation: result.explanation,
      trustScore: 75 + Math.floor(Math.random() * 20), // Simulated
      verified: true,
      createdAt: new Date(),
    };
    
    addListing(newListing);
    setStep('complete');
  };

  const getSuggestedPrice = () => {
    if (!formData.grainType) return null;
    const marketPrice = MARKET_PRICES.find(p => p.grainType === formData.grainType);
    return marketPrice?.avgPrice;
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto text-center animate-fade-in">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-grade-a/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-grade-a" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold">Listing Published!</h2>
                <p className="text-muted-foreground">
                  Your {formData.grainType} listing has been AI-verified and is now live on the marketplace.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => {
                  setStep('form');
                  setFormData({ grainType: '', quantity: '', price: '', location: '' });
                  setImages([]);
                  setVerificationResult(null);
                }}>
                  List Another
                </Button>
                <Button onClick={() => navigate('/marketplace')}>
                  View Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="font-serif text-3xl font-bold">List Your Grain</h1>
            <p className="text-muted-foreground">
              Submit your grain for AI quality verification and reach verified buyers
            </p>
          </div>

          {step === 'form' ? (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-primary" />
                  Product Details
                </CardTitle>
                <CardDescription>
                  Provide accurate information for better quality verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grain Type */}
                <div className="space-y-2">
                  <Label htmlFor="grainType">Grain Type</Label>
                  <Select 
                    value={formData.grainType} 
                    onValueChange={(value: GrainType) => setFormData(prev => ({ ...prev, grainType: value }))}
                  >
                    <SelectTrigger id="grainType">
                      <SelectValue placeholder="Select grain type" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRAIN_TYPES.map(grain => (
                        <SelectItem key={grain.value} value={grain.value}>
                          {grain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity & Price Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="flex items-center gap-1">
                      <Scale className="h-4 w-4" />
                      Quantity (Quintals)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      Price per Quintal
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder={getSuggestedPrice() ? `Suggested: ₹${getSuggestedPrice()}` : 'e.g., 2500'}
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                    {getSuggestedPrice() && (
                      <p className="text-xs text-muted-foreground">
                        Market average: ₹{getSuggestedPrice()?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Grain Images
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {images.length > 0 ? (
                        <div className="space-y-2">
                          <CheckCircle2 className="h-8 w-8 mx-auto text-grade-a" />
                          <p className="font-medium">{images.length} image(s) selected</p>
                          <p className="text-sm text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="font-medium">Upload grain images</p>
                          <p className="text-sm text-muted-foreground">
                            Clear, well-lit photos for better AI verification
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  {/* TODO: Images will be uploaded to Azure Blob Storage */}
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleSubmitForVerification}
                >
                  Submit for AI Quality Verification
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AIVerification 
              images={images} 
              onComplete={handleVerificationComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
