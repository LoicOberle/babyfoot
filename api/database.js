const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("babyfoot", "root", "rootpassword", {     
 
    host: 'db',     
    dialect: 'mysql',
});

module.exports = sequelize;