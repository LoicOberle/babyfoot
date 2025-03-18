const express = require('express')
const app = express()
const port = 3000
const cors=require('cors')

const sequelize = require("./database"); 

const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080'];

app.options('*', cors())
app.use(
    cors({
      origin:  (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }, // Autorise uniquement ce domaine
      methods: ["GET", "POST","PUT","DELETE"], // Autorise uniquement GET et POST
      allowedHeaders: ["Content-Type", "Authorization"], // Autorise ces en-têtes
   
    })
  );
app.use(express.json()); // Enable JSON body parsing

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Swagger Route
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



//Routes pour utilisateurs: non utilisées pour ce projet
const userRoutes = require("./routes/user_routes");
app.use("/user", userRoutes);

const authRoutes = require("./routes/auth_routes");
app.use("/auth", authRoutes);
const tournamentRoutes = require("./routes/tournament_routes");
app.use("/tournament", tournamentRoutes);
const teamRoutes = require("./routes/team_routes");
app.use("/team", teamRoutes);
const matchRoutes = require("./routes/match_routes");
app.use("/match", matchRoutes);


async function testConnection() {   
  try {     
        await sequelize.authenticate();
        console.log('Base de données connectée');
        sequelize.sync({ force: false }) // Use { force: true } only to recreate tables (DANGER: Deletes existing data!)
    .then(() => {
        console.log("Synchronisation avec la base de donnéee réussie!");
        app.listen(port,() => {
            console.log(`L'api est accessible sur le port ${port}`)
          })
    })
    .catch((err) => {
        console.error("Synchronisation avec la base de données échouée:", err);
    });
  


  } catch (error) {
        //ensure you created the database 
        //check database credentials
        console.error('Impossible de se connecter à la base de données, nouvelle tentative dans une seconde', error);
        await new Promise(res => setTimeout(res, 1000));
        testConnection()
     }
  }
  testConnection();
  




