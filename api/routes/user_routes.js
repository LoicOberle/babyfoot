const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../middlewares/auth");

// Get all users
router.get("/",authenticate, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
    
        
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

// Get a specific user by ID
router.get("/:id",authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve user" });
    }
});

// ✅ Add a new user (POST)
router.post("/", authenticate,async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }
        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

// ✅ Modify an existing user (PUT)
router.put("/:id", authenticate,async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.update({ name, email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// ✅ Delete a user (DELETE)
router.delete("/:id",authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

module.exports = router;
