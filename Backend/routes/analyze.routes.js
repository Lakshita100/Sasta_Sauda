import express from "express";
import upload from "../middleware/upload.js";

import { uploadToBlob } from "../services/blob.service.js";
import { runVisionCheck } from "../services/vision.service.js";

import {
  predictGrainType,
  predictWheatQuality,
  predictRiceQuality
} from "../services/customVision.service.js";

import { calculateTrustScore } from "../services/trustScore.service.js";

const router = express.Router();

router.post("/analyze-grain", upload.single("file"), async (req, res) => {
  try {
    // -------- 0. Validation --------
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}_${req.file.originalname}`;

    // -------- 1. Upload to Azure Blob (storage only) --------
    const imageUrl = await uploadToBlob(fileBuffer, fileName);

    // -------- 2. Azure Vision blur check (URL-based) --------
    const isBlurred = await runVisionCheck(imageUrl);
    if (isBlurred) {
      return res.status(400).json({ error: "Image is too blurry" });
    }

    // -------- 3. Grain Type Prediction (Custom Vision - BUFFER) --------
    const grainResult = await predictGrainType(fileBuffer);

    if (!grainResult?.predictions?.length) {
      return res.status(400).json({ error: "Unable to detect grain type" });
    }

    const grainPrediction = grainResult.predictions[0];
    const grainType = grainPrediction.tagName;

    // -------- 4. Quality Prediction based on grain --------
    let qualityResult = null;

    if (grainType === "wheat") {
      qualityResult = await predictWheatQuality(fileBuffer);
    } 
    else if (grainType === "rice") {
      qualityResult = await predictRiceQuality(fileBuffer);
    } 
    else {
      return res.json({
        imageUrl,
        grainType,
        message: "Quality model not available for this grain (MVP scope)"
      });
    }

    if (!qualityResult?.predictions?.length) {
      return res.status(400).json({
        error: `Unable to detect ${grainType} quality`
      });
    }

    const qualityPrediction = qualityResult.predictions[0];
    const quality = qualityPrediction.tagName;
    const probability = qualityPrediction.probability;

    // -------- 5. Trust Score --------
    const trustScore = calculateTrustScore(quality, probability);

    // -------- 6. Final Response --------
    res.json({
      imageUrl,
      grainType,
      quality,
      confidence: probability,
      trustScore
    });

  } catch (err) {
    console.error("Analyze Grain Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
