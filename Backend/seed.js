const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Listing = require("./models/Listing");

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  dbName: "sastasauda",
});

    console.log("DB connected for seeding");

    await Listing.deleteMany();

    const data = await Listing.create([
      {
        grainType: "rice",
        sellerName: "Ram Farmer",
        location: "Maharashtra",
        quantity: 40,
        pricePerQuintal: 2800,
        qualityGrade: "A",
        confidenceScore: 95,
        qualityExplanation: "Premium quality, low moisture",
        verified: true,
      },
      {
        grainType: "wheat",
        sellerName: "Suresh Farmer",
        location: "MP",
        quantity: 60,
        pricePerQuintal: 2400,
        qualityGrade: "B",
        confidenceScore: 88,
        qualityExplanation: "Good quality grains",
        verified: true,
      }
    ]);

    console.log("✅ Seed data inserted:", data.length);
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
