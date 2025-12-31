const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const upload = require("../middleware/upload");

// CREATE LISTING (SELLER)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file ? "TEMP_IMAGE_URL" : null;

    const listing = await Listing.create({
      ...req.body,
      imageUrl,
      verified: false,
      confidenceScore: 0,
      qualityExplanation: "Pending AI verification"
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create listing" });
  }
});

// GET LISTINGS
router.get("/", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

module.exports = router;
