import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    grainType: String,
    sellerName: String,
    location: String,
    quantity: Number,
    pricePerQuintal: Number,
    qualityGrade: String,
    confidenceScore: Number,
    qualityExplanation: String,
    verified: Boolean,
    imageUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
