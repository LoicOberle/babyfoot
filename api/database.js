const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("babyfoot", "babyfoot", "babyfoot", {     
 
    host: 'db',     
    dialect: 'mysql',
});

module.exports = sequelize;