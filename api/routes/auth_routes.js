const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth");

// Load environment variables
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un nom d'utilisateur, email et mot de passe
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword123"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *       400:
 *         description: Champs manquants ou email déjà utilisé
 *       500:
 *         description: Erreur de serveur
 */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
       
        res.status(500).json({ error: "Registration failed" });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connection
 *     description: Connecte un utilisateur et retourne un token JWT
 *     tags:
 *      - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       400:
 *         description: Email ou mot de passe manquant
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur de serveur
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
       
        res.status(500).json({ error: "Login failed" });
    }
});


/**
 * @swagger
 * /auth/valid:
 *   get:
 *     summary: Validité du token
 *     description: Vérifie si le token JWT est valide
 *     tags:
 *       - Authentification
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Le token est valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token valid"
 *       401:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur de serveur
 */
router.get("/valid",authenticate,async (req,res)=>{
    return res.status(200).json({message:"Token valid"})
})

module.exports = router;
