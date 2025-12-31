const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // <--- THIS WAS MISSING

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        console.log("Incoming Data:", { name, email, role }); 

        // 1. Check if user exists
        // Note: 'User' must be imported above to use findOne
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        
        // 4. Generate Token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET  || 'fallback_secret_for_development', 
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            token, 
            role: newUser.role, 
            name: newUser.name 
        });



        
    } catch (err) {
        console.error("Mongoose Error:", err.message);
        res.status(400).json({ 
            message: "Registration Error", 
            details: err.message 
        });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.json({ token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;