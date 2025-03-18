const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Your Sequelize instance
const Team = require("./Team");
const Tournament = require("./Tournament");

const Match = sequelize.define(
    "Match",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        team1id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Team, // Foreign key references User model
                key: "id",
            },
            onDelete: "CASCADE",  // If a user is deleted, delete their posts
        },
        team2id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Team, // Foreign key references User model
                key: "id",
            },
            onDelete: "CASCADE",  // If a user is deleted, delete their posts
        },
        team1score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:0
        },
        team2score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:0
        },
        done:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            
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
        tableName: "matches",
        timestamps: false, // Disable timestamps if not needed
        getterMethods: {
            winner() {
                if(this.done){
                    if(this.team1score > this.team2score){
                        return this.team1id
                    }else if(this.team1score < this.team2score){
                        return this.team2id
                    }else{
                        return -1
                    }
                }else{
                    return false
                }
            }
        }
    }
);

Match.belongsTo(Team, { as: 'team1', foreignKey: 'team1id' });
Match.belongsTo(Team, { as: 'team2', foreignKey: 'team2id' });
Match.belongsTo(Tournament, { foreignKey: 'tournamentid' });


module.exports = Match;
