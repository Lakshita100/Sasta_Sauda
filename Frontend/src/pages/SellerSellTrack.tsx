import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SellerSellTrack() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("token");

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

  /* ===============================
     AUTO REFRESH (POLLING)
  =============================== */
  useEffect(() => {
    fetchMyListings();

    intervalRef.current = setInterval(() => {
      fetchMyListings();
    }, 5000); // ⏱ every 5 sec

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ===============================
     RE-UPLOAD HANDLER
  =============================== */
  const handleReupload = async (
    listingId: string,
    file: File | null
  ) => {
    if (!file) return;

    try {
      setUploadingId(listingId);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", file);

      await axios.put(
        `http://localhost:5000/api/listings/reupload/${listingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchMyListings();
    } catch (err) {
      console.error("❌ Reupload failed:", err);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <>
      <Header />

      <main className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Sell Track</h1>
          <p className="text-sm text-muted-foreground">
            🔄 Auto-refreshing every 5 seconds
          </p>
        </div>

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
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.grainType}
                    className="h-40 w-full object-cover"
                  />
                )}

                <CardContent className="p-4 space-y-3">
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
                      ⏳ AI verification in progress…
                    </p>
                  )}

                  {(item.status === "REJECTED" ||
                    item.status === "REUPLOAD_REQUIRED") && (
                    <div className="space-y-2">
                      <p className="text-red-600 text-sm font-medium">
                        ❌ Action Required
                      </p>

                      {item.rejectionReason && (
                        <p className="text-xs text-muted-foreground">
                          Reason: {item.rejectionReason}
                        </p>
                      )}

                      <label className="block text-sm font-medium">
                        Re-upload Image
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleReupload(
                            item._id,
                            e.target.files?.[0] || null
                          )
                        }
                        disabled={uploadingId === item._id}
                      />

                      {uploadingId === item._id && (
                        <p className="text-xs text-muted-foreground">
                          Uploading & re-verifying…
                        </p>
                      )}
                    </div>
                  )}

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
