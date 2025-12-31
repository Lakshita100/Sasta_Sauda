const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');
const listingsRoutes = require("./routes/listings");



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


// Health Check
app.get('/', (req, res) => res.send('SastaSauda API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));