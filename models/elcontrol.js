const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Elcontrol extends Model {}
  return Elcontrol.init({
    card: {
      type: DataTypes.INTEGER
    },
    relay: {
      type: DataTypes.INTEGER,
      unique: true
    },
    type: {
      type: DataTypes.STRING
    },
    groupname: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER
    },
    kwh: {
      type: DataTypes.INTEGER
    }


  }, {
    sequelize,
    modelName: 'Elcontrol',
    timestamps: false,
  });

};