import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import connectDB from './config/db.js';
import listingsRoutes from "./routes/listings.js";
import analyzeRoutes from "./routes/analyze.routes.js";
import marketPricesRoutes from "./routes/marketPrices.js"

dotenv.config();
const app = express();


// db connection 
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api", analyzeRoutes);
app.use("/api/market-prices", marketPricesRoutes);


// Health Check
app.get('/', (req, res) => res.send('SastaSauda API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));