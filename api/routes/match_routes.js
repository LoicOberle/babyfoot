const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");
const authenticate = require("../middlewares/auth");


/**
 * @swagger
 * /match:
 *   post:
 *     summary: Création de match
 *     description: Crée un match entre deux équipes d'un même tournoi
 *     tags:
 *       - Matches
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team1id
 *               - team2id
 *               - tournamentid
 *             properties:
 *               team1id:
 *                 type: integer
 *                 example: 1
 *               team2id:
 *                 type: integer
 *                 example: 2
 *               tournamentid:
 *                 type: integer
 *                 example: 3
 *               team1score:
 *                 type: integer
 *                 example: 0
 *               team2score:
 *                 type: integer
 *                 example: 0
 *               done:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Match créé avec succès
 *       400:
 *         description: Équipes ou tournoi manquants
 *       404:
 *         description: Équipe ou tounois non trouvés
 *       500:
 *         description: Erreur de serveur
 */
router.post("/",authenticate, async (req, res) => {
    const { team1id, team2id, tournamentid, team1score = 0, team2score = 0, done = false } = req.body;

    // Validate that both teams and tournament id are provided
    if (!team1id || !team2id || !tournamentid) {
        return res.status(400).json({ error: "Both teams and tournament ID are required." });
    }

    try {
        // Check if both teams exist
        const team1 = await Team.findByPk(team1id);
        const team2 = await Team.findByPk(team2id);
        if (!team1 || !team2) {
            return res.status(404).json({ error: "One or both teams not found." });
        }

        // Check if the tournament exists
        const tournament = await Tournament.findByPk(tournamentid);
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found." });
        }

        // Create the match
        const match = await Match.create({
            team1id,
            team2id,
            team1score,
            team2score,
            done,
            tournamentid
        });

        res.status(201).json({ message: "Match created successfully.", match });
    } catch (error) {
      
        res.status(500).json({ error: "Error creating match." });
    }
});

/**
 * @swagger
 * /match/tournament/{id}:
 *   get:
 *     summary: Matches d'un tournoi
 *     description: Récupère tous les matches d'un tounois
 *     tags:
 *       - Matches
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Matches obtenus avec succès
 *       400:
 *         description: Identifiant du tournoi requis
 *       500:
 *         description: Erreur de serveur
 */
router.get("/tournament/:id",async (req, res) => {
    const { id } = req.params;
    const tournamentid=id

    if (!tournamentid) {
        return res.status(400).json({ error: "Tournament ID is required." });
    }

    try {
        let matches = await Match.findAll({
            where: { tournamentid },
            include: [
                { model: Team, as: "team1", attributes: ["id", "name"] },
                { model: Team, as: "team2", attributes: ["id", "name"] }
            ]
        });

        res.status(200).json(matches);
    } catch (error) {
       
        res.status(500).json({ error: "Error retrieving matches." });
    }
});

/**
 * @swagger
 * /match/{id}:
 *   put:
 *     summary: Mise à jour d'un match
 *     description: Met à jour le score des équipes et/ou termine le match 
 *     tags:
 *       - Matches
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team1score:
 *                 type: integer
 *                 example: 2
 *               team2score:
 *                 type: integer
 *                 example: 3
 *               done:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Match mis à jour avec succès
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id",authenticate, async (req, res) => {
    const { id } = req.params;
    const { team1score, team2score, done } = req.body;

    try {
        const match = await Match.findByPk(id);

        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }

        // Update the match fields
        if (team1score !== undefined) match.team1score = team1score;
        if (team2score !== undefined) match.team2score = team2score;
        if (done !== undefined) match.done = done;

        await match.save();

        res.status(200).json({ message: "Match updated successfully.", match });
    } catch (error) {
        res.status(500).json({ error: "Error updating match." });
    }
});

/**
 * @swagger
 * /match/{id}:
 *   delete:
 *     summary: Suppression d'un match
 *     description: Supprime un match
 *     tags:
 *       - Matches
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match supprimé avec succès
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id",authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const match = await Match.findByPk(id);

        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }

        await match.destroy();

        res.status(200).json({ message: "Match deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Error deleting match." });
    }
});


/**
 * @swagger
 * /match/{id}/winner:
 *   get:
 *     summary: Gagnant d'un match
 *     description: Récupère le gagnant d'un match. renvoi -1 si il y a égalité, et false si le match n'est pas terminé.
 *     tags:
 *       - Matches
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Gagant récupéré avec succès
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/winner",async (req, res) => {
    const { id } = req.params;

    try {
        const match = await Match.findByPk(id);

        if (!match) {
            return res.status(404).json({ error: "Match not found." });
        }

        let winner=match.winner

        res.status(200).json({ message:winner });
    } catch (error) {
        res.status(500).json({ error: "Error finding winner for this match." });
    }
});

module.exports = router;
