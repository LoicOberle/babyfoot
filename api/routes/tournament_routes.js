const express = require("express");
const router = express.Router();
const Tournament = require("../models/Tournament");
const authenticate = require("../middlewares/auth");
const Match = require("../models/Match")
const Team = require("../models/Team")


/**
 * @swagger
 * /tournament:
 *   get:
 *     summary: Tous les tournois
 *     tags: [Tournois]
 *     description: Récupère tous les tournois
 *     responses:
 *       200:
 *         description: La liste des tournois
 *       500:
 *         description: Erreur serveur
 */
router.get("/", async (req, res) => {
    try {
        const tournaments = await Tournament.findAll({
            order: [['date', 'DESC']] // Tri par date de création, du plus récent au plus ancien
          });
        // Loop through each tournament and check if all its matches are done
        // Loop through each tournament and check if all its matches are done
        const tournamentData = await Promise.all(tournaments.map(async (tournament) => {
            // Convert the Sequelize instance to a plain object
            const tournamentJSON = tournament.toJSON();

            // Get all matches for the current tournament
            const matches = await Match.findAll({
                where: { tournamentid: tournament.id }
            });
            const teams=await Team.findAll({
                where: { tournamentid: tournament.id }
            })

            // Check if all matches are done

            let isDone = matches.every((match) => match.done);
            if(matches.length==0){
              isDone=false  
            }
            // Add the 'done' field to the plain object
            tournamentJSON.done = isDone;
            if(isDone && matches.length>0){
                // Get the winner for this tournament based on match results
                let teamPoints = {};
                matches.forEach((match) => {
                    
                    const winner = match.winner; // Assuming the getter for winner is implemented in Match model
                    if(winner){
                        if(winner>-1){
                            teamPoints[winner] = (teamPoints[winner] || 0) + 2;
                            teamPoints[match.team1id] = (teamPoints[match.team1id] || 0) + 1;
                            teamPoints[match.team2id] = (teamPoints[match.team2id] || 0) + 1;
                        }else{
                            teamPoints[match.team1id] = (teamPoints[match.team1id] || 0) + 2;
                            teamPoints[match.team2id] = (teamPoints[match.team2id] || 0) + 2;
                        }
                    }
                   
                });
          
                
                // Find the team with the most points
                const winnerId = Object.keys(teamPoints).reduce((a, b) => teamPoints[a] > teamPoints[b] ? a : b);

                // Determine if it's a draw (more than one team has the most points)
                const maxPoints = teamPoints[winnerId];
                // Find all teams with the maximum points (ex-aequo teams)
                const exAequoTeams = Object.keys(teamPoints).filter(
                    (teamId) => teamPoints[teamId] === maxPoints
                );
               

                const ranking = Object.fromEntries(
                    Object.entries(teamPoints)
                      .sort((a, b) => b[1] - a[1]) // Sort by values
                      .map(([key, value]) => [
                        (teams.find((el)=>el.id==key)).name
                        , value]) // Map the keys (e.g., prefix 'key-')
                  );
                  
                tournamentJSON.ranking=ranking

                // If only one team has the max points, it's the winner
                if (exAequoTeams.length === 1) {
                    tournamentJSON.winner = exAequoTeams[0]; // Single winner
                   tournamentJSON.winner=(teams.find((el)=>el.id==tournamentJSON.winner)).name
                } else {
                    tournamentJSON.winner=[]
                    exAequoTeams.forEach(element => {
                        let team=(teams.find((el)=>el.id==element)).name
                        tournamentJSON.winner.push(team)
                    });
                    
                }
            }
            

            return tournamentJSON;
        }));
      
        res.json(tournamentData);
    } catch (error) {
     
        
        res.status(500).json({ error: "Failed to retrieve Tournaments" });
    }
});

/**
 * @swagger
 * /tournament/{id}:
 *   get:
 *     summary: Tournoi par id
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id du tournoi
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Le tournoi
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", async (req, res) => {
    try {
        const tournament = await Tournament.findByPk(req.params.id);
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        const matches = await Match.findAll({
            where: { tournamentid:tournament.id },
            include: [
                { model: Team, as: "team1", attributes: ["id", "name"] },
                { model: Team, as: "team2", attributes: ["id", "name"] }
            ]
        });
        tournament.done=matches.every((match) => match.done === true);
     
        

        res.json(tournament);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve Tournament" });
    }
});

/**
 * @swagger
 * /tournament:
 *   post:
 *     summary: Création de tournoi
 *     tags: [Tournois]
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
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du tournoi
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date du tournoi
 *               description:
 *                 type: string
 *                 description: Description du tournoi
 *     responses:
 *       201:
 *         description: Tournoi créé avec succès
 *       400:
 *         description: Champs manquants
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authenticate,async (req, res) => {
    try {
        const { name, description,date } = req.body;
        if (!name || !date) {
            return res.status(400).json({ error: "Name and description are required" });
        }
        const newTournament = await Tournament.create({ name, date,description });
        res.status(201).json(newTournament);
    } catch (error) {
        res.status(500).json({ error: "Failed to create Tournament" });
    }
});


/**
 * @swagger
 * /tournament/{id}:
 *   delete:
 *     summary: Suppression de tournoi
 *     tags: [Tournois]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id du tournoi
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tournoi supprimé avec succès
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id",authenticate, async (req, res) => {
    try {
        const tournament = await Tournament.findByPk(req.params.id);
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        await tournament.destroy();
        res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Tournament" });
    }
});


/**
 * @swagger
 * /tournament/{id}/shuffle:
 *   post:
 *     summary: Génération de matchs
 *     tags: [Tournois]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id du tournoi
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Matchs créés avec succès
 *       400:
 *         description: Pas assez d'équipe pour créer les matchs
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/shuffle", authenticate,async (req, res) => {
    const { id } = req.params;
    const tournamentid=id
    try {
        const tournament = await Tournament.findByPk(tournamentid);
       
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found." });
        }
        const deletedMatches = await Match.destroy({
            where: { tournamentid }
        });

        const teams = await Team.findAll({
            where: { tournamentid },
            attributes: ['id', 'name'], // Adjust the attributes you want to return
        });

        if (teams.length < 2) {
            return res.status(400).json({ error: "At least two teams are required to generate matches." });
        }

        // Generate matches for all pairs of teams
        const matches = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                const match = {
                    team1id: teams[i].id,
                    team2id: teams[j].id,
                    tournamentid,
                    team1score: 0, // Default score
                    team2score: 0, // Default score
                    done: false, // Match is not done yet
                };
                matches.push(match);
            }
        }

        // Insert all generated matches into the database
        await Match.bulkCreate(matches);

        res.status(201).json({
            message: `${matches.length} matches successfully created.`,
            matchesCreated: matches.length,
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to shuffle Tournament" });
    }
});

module.exports = router;
