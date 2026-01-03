import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    grainType: String,
    predictedGrain: String,

    location: String,
    quantity: Number,
    pricePerQuintal: Number,

    imageUrl: String,

    // AI fields
    qualityGrade: String,
    confidenceScore: Number,
    qualityExplanation: String,

    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: String,
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
