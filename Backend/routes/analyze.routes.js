import express from "express";
import upload from "../middleware/upload.js";

import { uploadToBlob } from "../services/blob.service.js";
import { runVisionCheck } from "../services/vision.service.js";
import {
  predictGrainType,
  predictWheatQuality
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

    if (!grainResult.predictions || grainResult.predictions.length === 0) {
      return res.status(400).json({ error: "Unable to detect grain type" });
    }

    const grainPrediction = grainResult.predictions[0];
    const grainType = grainPrediction.tagName;

    // -------- 4. If not wheat, return early (MVP scope) --------
    if (grainType !== "wheat") {
      return res.json({
        imageUrl,
        grainType,
        message: "Quality model available only for wheat (MVP)"
      });
    }

    // -------- 5. Wheat Quality Prediction (Custom Vision - BUFFER) --------
    const qualityResult = await predictWheatQuality(fileBuffer);

    if (!qualityResult.predictions || qualityResult.predictions.length === 0) {
      return res.status(400).json({ error: "Unable to detect wheat quality" });
    }

    const qualityPrediction = qualityResult.predictions[0];
    const quality = qualityPrediction.tagName;
    const probability = qualityPrediction.probability;

    // -------- 6. Trust Score --------
    const trustScore = calculateTrustScore(quality, probability);

    // -------- 7. Final Response --------
    res.json({
      imageUrl,
      grainType,
      quality,
      confidence: probability,
      trustScore
    });

  } catch (err) {
    console.error("Analyze Grain Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
