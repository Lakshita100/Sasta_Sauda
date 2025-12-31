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

export default function SellerDashboard() {
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    grainType: "",
    location: "",
    quantity: "",
    pricePerQuintal: "",
    qualityGrade: "A",
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
      formData.append("grainType", form.grainType);
      formData.append("location", form.location);
      formData.append("quantity", form.quantity);
      formData.append("pricePerQuintal", form.pricePerQuintal);
      formData.append("qualityGrade", form.qualityGrade);
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
        grainType: "",
        location: "",
        quantity: "",
        pricePerQuintal: "",
        qualityGrade: "A",
      });
      setImage(null);

    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to submit listing");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Seller Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload grain details with image for AI verification
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Grain Type</Label>
            <Input
              name="grainType"
              value={form.grainType}
              onChange={handleChange}
              placeholder="Rice / Wheat / Dal"
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="State / District"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity (quintals)</Label>
              <Input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Price per Quintal (₹)</Label>
              <Input
                name="pricePerQuintal"
                type="number"
                value={form.pricePerQuintal}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Quality Grade</Label>
            <Select
              value={form.qualityGrade}
              onValueChange={(value) =>
                setForm({ ...form, qualityGrade: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Grade A</SelectItem>
                <SelectItem value="B">Grade B</SelectItem>
                <SelectItem value="C">Grade C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <Label>Upload Grain Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <Button className="w-full mt-4" onClick={submitListing}>
            Submit Listing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
