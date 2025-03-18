const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Your Sequelize instance
const Tournament = require("./Tournament");


const Team = sequelize.define(
    "Team",
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
        tournamentid:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Tournament, 
                key: "id",
            },
            onDelete: "CASCADE",  
        }
    
    },
    {
        tableName: "teams",
        timestamps: false, // Disable timestamps if not needed
    }
);
Team.belongsTo(Tournament, { foreignKey: 'tournamentid' });

module.exports = Team;
