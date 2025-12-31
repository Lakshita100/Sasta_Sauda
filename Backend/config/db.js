const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'sastasauda',
      // Recommended settings for Azure Cosmos DB
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      tls: true
    });
    console.log("🚀 Success: Connected to SastaSauda Azure DB");
  } catch (err) {
    console.error("❌ Connection failed! Did you whitelist your IP in Azure? Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;