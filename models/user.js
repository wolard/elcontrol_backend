const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {}
  return User.init({
    firstname: {
      type: DataTypes.STRING,

    },
    surname: {
      type: DataTypes.STRING,

    },
    serialnumber: {
      type: DataTypes.INTEGER,
      unique: true

    }
  }, {
    sequelize,
    modelName: 'User'
  });

};