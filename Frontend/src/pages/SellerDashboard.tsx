import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Header } from "@/components/Header";



export default function SellerDashboard() {
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    location: "",
    quantity: "",
    pricePerQuintal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitListing = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      if (!image) {
        toast.error("Please upload an image");
        return;
      }

      const formData = new FormData();
      formData.append("location", form.location);
      formData.append("quantity", form.quantity);
      formData.append("pricePerQuintal", form.pricePerQuintal);
      formData.append("image", image);

      await axios.post(
        "http://localhost:5000/api/listings",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("✅ Listing submitted successfully!");

      // reset form
      setForm({
        location: "",
        quantity: "",
        pricePerQuintal: "",
      });
      setImage(null);

    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to submit listing");
    }
  };

return (
  <>
    {/* Navbar */}
    <Header />

    {/* Background Overlay */}
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      
      {/* Popup Card */}
      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border border-green-100 animate-in fade-in zoom-in duration-300">
        
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-3xl font-bold text-green-700">
            Seller Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload grain details with image for AI verification
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          
          {/* Location */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="State / District"
              className="focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                Quantity (quintals)
              </Label>
              <Input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">
                Price per Quintal (₹)
              </Label>
              <Input
                name="pricePerQuintal"
                type="number"
                value={form.pricePerQuintal}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">
              Upload Grain Image
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="cursor-pointer file:bg-green-100 file:text-green-700 file:border-0 file:px-4 file:py-2 file:rounded-md hover:file:bg-green-200"
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={submitListing}
          >
            🚜 Submit Listing
          </Button>
        </CardContent>
      </Card>
    </div>
  </>
);

}