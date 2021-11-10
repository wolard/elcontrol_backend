const dbConfig = require("../db/dbconfig.js");
const dbSeed = require("../db/seeddata.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  storage:dbConfig.storage
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.elcontrol = require("./elcontrol.js")(sequelize, Sequelize);
db.authorize = require("./authorize.js")(sequelize, Sequelize);


module.exports = db;