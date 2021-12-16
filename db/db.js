const {
  Sequelize
} = require('sequelize');
const User = require('../models/user');
const Car = require('../models/car');
const ElControl = require('../models/elcontrol');
const Kwh = require('../models/kwh');
const Authorize = require('../models/authorize');
const DBConf = require('./dbconf');
const SeedDb = require('./seeddb');

const sequelize = new Sequelize(DBConf);
const auth = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
const dbInit = async () => {
  
  await auth();
  const db = {}
  db.users = User(sequelize);
  db.cars = Car(sequelize);
  db.elControls = ElControl(sequelize);
  db.kwhs = Kwh(sequelize);
  db.authorizes = Authorize(sequelize);

  db.users.hasMany(db.cars, {
    sourceKey: 'serialnumber',
    foreignKey: 'userserialnumber'
  });
  
  db.elControls.hasMany(db.kwhs, {
    sourceKey: 'relay',
    foreignKey: 'elcontrolrelay'
  });
  
  //await sequelize.sync({force: true})
  

  //await SeedDb.seedDb(db.users, db.cars,db.elControls,db.authorizes);
  
  return db;

};
module.exports.dbInit = dbInit;