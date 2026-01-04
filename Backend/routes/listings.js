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

/**
 * ===========================
 * SELLER: UPLOAD LISTING
 * ===========================
 */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }

      // 1️⃣ Upload image to Azure Blob
      const imageUrl = await uploadToAzure(req.file);

      // 2️⃣ Create listing (PENDING)
      const listing = await Listing.create({
        sellerId: req.user.id,
        grainType: req.body.grainType,
        location: req.body.location,
        quantity: req.body.quantity,
        pricePerQuintal: req.body.pricePerQuintal,
        imageUrl,
        status: "PENDING",
      });

      // 3️⃣ AI: Predict grain type
      const grainResult = await predictGrainType(req.file.buffer);
      const predictedGrain = grainResult.predictions[0].tagName;

      // 4️⃣ AI: Predict quality
      let qualityResult;
      if (predictedGrain === "wheat") {
        qualityResult = await predictWheatQuality(req.file.buffer);
      } else if (predictedGrain === "rice") {
        qualityResult = await predictRiceQuality(req.file.buffer);
      }

      const best = qualityResult.predictions[0];

      // 5️⃣ Final decision
      if (best.probability >= 0.7) {
        listing.status = "VERIFIED";
        listing.predictedGrain = predictedGrain;
        listing.qualityGrade = best.tagName;
        listing.confidenceScore = Math.round(best.probability * 100);
        listing.qualityExplanation = `AI verified with ${Math.round(
          best.probability * 100
        )}% confidence`;
      } else {
        listing.status = "REJECTED";
        listing.rejectionReason = "Low AI confidence";
      }

      await listing.save();

      res.status(201).json({
        message: "Listing processed",
        listing,
      });
    } catch (err) {
      console.error("❌ LISTING ERROR:", err);
      res.status(500).json({ message: "Listing failed" });
    }
  }
);

/**
 * ===========================
 * BUYER: VIEW VERIFIED LISTINGS
 * ===========================
 */
router.get("/verified", async (req, res) => {
  try {
    const listings = await Listing.find({ status: "VERIFIED" });
    res.json(listings);
  } catch (err) {
    console.error("❌ FETCH VERIFIED ERROR:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

// ===============================
// SELLER - MY LISTINGS (SELL TRACK)
// ===============================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const sellerId = req.user.id || req.user._id || req.user.userId;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID missing in token" });
    }

    const listings = await Listing.find({ sellerId });

    res.json(listings);
  } catch (err) {
    console.error("SELL TRACK ERROR:", err);
    res.status(500).json({ message: "Failed to fetch seller listings" });
  }
});


export default router;
