import express from "express";
import axios from "axios";

const router = express.Router();

// 🔐 In-memory cache
let cachedPrices = [];
let lastFetchTime = 0;

// ⏱ Fetch interval (6 hours)
const FETCH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

router.get("/", async (req, res) => {
  const now = Date.now();

  // ✅ Serve cached data if within time window
  if (cachedPrices.length && now - lastFetchTime < FETCH_INTERVAL) {
    return res.json({
      source: "cache",
      lastUpdated: new Date(lastFetchTime).toISOString(),
      data: cachedPrices,
    });
  }

  try {
    console.log("Fetching fresh data from government API...");

    const response = await axios.get(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
      {
        timeout: 15000,
        params: {
          "api-key": process.env.DATA_GOV_API_KEY,
          format: "json",
          limit: 50,
        },
      }
    );

    const records = response.data.records || [];

    const cleanedData = records.map((item) => ({
      grainType: item.commodity,
      mandi: item.market,
      state: item.state,
      district: item.district,
      minPrice: Number(item.min_price),
      maxPrice: Number(item.max_price),
      modalPrice: Number(item.modal_price),
      date: item.arrival_date,
    }));

    // 🔄 Update cache
    cachedPrices = cleanedData;
    lastFetchTime = now;

    res.json({
      source: "live",
      lastUpdated: new Date(lastFetchTime).toISOString(),
      data: cleanedData,
    });
  } catch (error) {
    console.error("Government API error:", error.message);

    // 🛡️ Fallback to cached data if available
    if (cachedPrices.length) {
      return res.json({
        source: "cache",
        lastUpdated: new Date(lastFetchTime).toISOString(),
        data: cachedPrices,
      });
    }

    res.status(503).json({
      message: "Government price service temporarily unavailable",
    });
  }
});

export default router;
