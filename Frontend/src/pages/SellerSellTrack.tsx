import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SellerSellTrack() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/listings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setListings(res.data);
      } catch (err) {
        console.error("❌ Sell Track Error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    fetchMyListings();

    // 🔁 AUTO REFRESH every 5 seconds (AI status update)
    const interval = setInterval(fetchMyListings, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <Header />

      <main className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">My Sell Track</h1>

        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-muted-foreground">
            No listings uploaded yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                {/* IMAGE */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.grainType}
                    className="h-40 w-full object-cover"
                  />
                )}

                <CardContent className="p-4 space-y-3">
                  {/* TITLE + STATUS */}
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg capitalize">
                      {item.grainType}
                    </h2>

                    <Badge
                      variant={
                        item.status === "VERIFIED"
                          ? "default"
                          : item.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    📍 {item.location}
                  </p>

                  <p>
                    Quantity: <b>{item.quantity}</b> quintals
                  </p>

                  <p>
                    Price: ₹<b>{item.pricePerQuintal}</b> / qtl
                  </p>

                  {/* STATUS MESSAGES */}
                  {item.status === "VERIFIED" && (
                    <p className="text-green-600 text-sm font-medium">
                      ✅ Live on Marketplace
                    </p>
                  )}

                  {item.status === "PENDING" && (
                    <p className="text-yellow-600 text-sm font-medium animate-pulse">
                      ⏳ AI verification in progress
                    </p>
                  )}

                  {item.status === "REJECTED" && (
                    <div className="space-y-2">
                      <p className="text-red-600 text-sm font-medium">
                        ❌ Rejected by AI
                      </p>

                      {item.rejectionReason && (
                        <p className="text-xs text-muted-foreground">
                          Reason: {item.rejectionReason}
                        </p>
                      )}

                      {/* FUTURE ACTIONS */}
                      <div className="flex gap-2">
                        <Button size="sm">
                          Re-upload Image
                        </Button>
                        <Button size="sm" variant="outline">
                          Request Inspection
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* AI EXPLANATION */}
                  {item.qualityExplanation && (
                    <p className="text-xs text-muted-foreground">
                      {item.qualityExplanation}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
