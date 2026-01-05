import express from "express";
import Listing from "../models/Listing.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { uploadToAzure } from "../services/blob.service.js";
import {
  predictGrainType,
  predictWheatQuality,
  predictRiceQuality,
} from "../services/customVision.service.js";

const router = express.Router();

/* =====================================================
   COMMON AI DECISION FUNCTION
===================================================== */
async function runAIVerification(listing, imageBuffer) {
  // 1️⃣ Predict grain type
  const grainResult = await predictGrainType(imageBuffer);

  if (!grainResult?.predictions?.length) {
    listing.status = "REUPLOAD_REQUIRED";
    listing.rejectionReason =
      "Grain not detected. Please upload a clearer image.";
    await listing.save();
    return listing;
  }

  const predictedGrain = grainResult.predictions[0].tagName;

  // 2️⃣ Predict quality
  let qualityResult;
  if (predictedGrain === "wheat") {
    qualityResult = await predictWheatQuality(imageBuffer);
  } else if (predictedGrain === "rice") {
    qualityResult = await predictRiceQuality(imageBuffer);
  } else {
    listing.status = "REJECTED";
    listing.rejectionReason = "Unsupported grain type detected";
    await listing.save();
    return listing;
  }

  if (!qualityResult?.predictions?.length) {
    listing.status = "REUPLOAD_REQUIRED";
    listing.rejectionReason =
      "Image unclear or low quality. Please re-upload.";
    await listing.save();
    return listing;
  }

  const best = qualityResult.predictions[0];
  const confidence = best.probability;

  // ❌ Wrong object (paper, phone, background)
  if (confidence < 0.3) {
    listing.status = "REJECTED";
    listing.rejectionReason = "Uploaded image is not a valid grain";
  }

  // 🔁 Blurry grain image
  else if (confidence < 0.7) {
    listing.status = "REUPLOAD_REQUIRED";
    listing.rejectionReason =
      "Image is blurry or unclear. Please upload a clearer image.";
  }

  // ✅ Verified
  else {
    listing.status = "VERIFIED";
    listing.predictedGrain = predictedGrain;
    listing.qualityGrade = best.tagName;
    listing.confidenceScore = Math.round(confidence * 100);
    listing.qualityExplanation = `AI verified with ${Math.round(
      confidence * 100
    )}% confidence`;
  }

  await listing.save();
  return listing;
}

/* =====================================================
   SELLER: CREATE LISTING
===================================================== */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }

      // Upload image
      const imageUrl = await uploadToAzure(req.file);

      // Create listing (PENDING initially)
      const listing = await Listing.create({
        sellerId: req.user.id,
        grainType: req.body.grainType,
        location: req.body.location,
        quantity: req.body.quantity,
        pricePerQuintal: req.body.pricePerQuintal,
        imageUrl,
        status: "PENDING",
      });

      // Run AI
      const finalListing = await runAIVerification(
        listing,
        req.file.buffer
      );

      return res.status(201).json({
        message: "Listing processed",
        listing: finalListing,
      });
    } catch (err) {
      console.error("❌ LISTING ERROR:", err);
      return res.status(500).json({ message: "Listing failed" });
    }
  }
);

/* =====================================================
   BUYER: VIEW VERIFIED LISTINGS
===================================================== */
router.get("/verified", async (req, res) => {
  try {
    const listings = await Listing.find({ status: "VERIFIED" });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

/* =====================================================
   SELLER: MY SELL TRACK
===================================================== */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ sellerId: req.user.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seller listings" });
  }
});

/* =====================================================
   SELLER: RE-UPLOAD IMAGE (AI RUNS AGAIN)
===================================================== */
router.put(
  "/reupload/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      if (listing.sellerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }

      // Upload new image
      const imageUrl = await uploadToAzure(req.file);
      listing.imageUrl = imageUrl;
      listing.status = "PENDING";
      listing.rejectionReason = null;

      await listing.save();

      // Run AI again
      const finalListing = await runAIVerification(
        listing,
        req.file.buffer
      );

      return res.status(200).json({
        message: "Re-upload processed",
        listing: finalListing,
      });
    } catch (err) {
      console.error("❌ REUPLOAD ERROR:", err);
      return res.status(500).json({ message: "Re-upload failed" });
    }
  }
);

export default router;
