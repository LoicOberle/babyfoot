const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Your Sequelize instance
// const Match = require("./Match")
// const Team = require("./Team")

const Tournament = sequelize.define(
    "Tournament",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    
    },
    {
        tableName: "tournaments",
        timestamps: false, // Disable timestamps if not needed
       
    
    }
);
// Tournament.hasMany(Match, { foreignKey: "tournamentid", as: "matches" });
// Tournament.hasMany(Team, { foreignKey: "tournamentid", as: "teams" });


module.exports = Tournament;
