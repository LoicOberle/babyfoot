const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");
const authenticate = require("../middlewares/auth");



/**
 * @swagger
 * /team:
 *   post:
 *     summary: Création d'équipe
 *     description: Crée une équipe
 *     tags:
 *       - Teams
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tournamentid
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Team A"
 *               tournamentid:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Équipe créée avec succès
 *       400:
 *         description: Nom ou tournoi manquants
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authenticate,async (req, res) => {
    const { name, tournamentid } = req.body;

    if (!name || !tournamentid) {
        return res.status(400).json({ error: "Name and tournament ID are required." });
    }

    try {
      
        const tournament = await Tournament.findByPk(tournamentid);
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found." });
        }

      
        const team = await Team.create({
            name,
            tournamentid
        });

        res.status(201).json({ message: "Team created successfully.", team });
    } catch (error) {
        res.status(500).json({ error: "Error creating team." });
    }
});


/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Récupération d'équipe
 *     description: Récupère une équipe par id
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id de l'équipe
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Équipe trouvée
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id",async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ error: "Team not found." });
        }
        
       
        const tournament = await Tournament.findByPk(team.tournamentid);
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found." });
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: "Error fetching team." });
    }
});


/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Mise à jour
 *     description: Met à jour une équipe
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id de l'équipe
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tournamentid
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Team Name"
 *               tournamentid:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Équipe mise à jour
 *       400:
 *         description: Nom ou id de tournoi manquant
 *       404:
 *         description: Équipe ou tournoi non trouvés
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id",authenticate, async (req, res) => {
    const { name, tournamentid } = req.body;

    if (!name || !tournamentid) {
        return res.status(400).json({ error: "Name and tournament ID are required." });
    }

    try {
       
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ error: "Team not found." });
        }

       
        const tournament = await Tournament.findByPk(tournamentid);
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found." });
        }

       
        team.name = name;
        team.tournamentid = tournamentid;
        await team.save();

        res.status(200).json({ message: "Team updated successfully.", team });
    } catch (error) {
        res.status(500).json({ error: "Error updating team." });
    }
});

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Suppression
 *     description: Supprime une équipe
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id de l'équipe
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Équipe supprimée
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id",authenticate, async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ error: "Team not found." });
        }

        await team.destroy();
        res.status(200).json({ message: "Team deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Error deleting team." });
    }
});


/**
 * @swagger
 * /team/tournament/{tournamentid}:
 *   get:
 *     summary: Equipes par tournoi
 *     description: Récupère la liste des équipes d'un même tournoi
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: tournamentid
 *         required: true
 *         description: id du tournoi
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des équipes
 *       500:
 *         description: Erreur serveur
 */
router.get("/tournament/:tournamentid", async (req, res) => {
    const { tournamentid } = req.params;

    try {
      
        const tournamentExists = await Tournament.findByPk(tournamentid);

        if (!tournamentExists) {
            return res.status(404).json({ error: "Tournament not found." });
        }

      
        const teams = await Team.findAll({
            where: { tournamentid },
            attributes: ['id', 'name'], 
        });


        res.status(200).json(teams);  
    } catch (error) {
        res.status(500).json({ error: "Error fetching teams." });
    }
});

module.exports = router;
