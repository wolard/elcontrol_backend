const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Car extends Model {}
  return Car.init({
    make: {
      type: DataTypes.STRING,

    },
    model: {
      type: DataTypes.STRING,

    }
   


  }, {
    sequelize,
    modelName: 'Car'
  });

};