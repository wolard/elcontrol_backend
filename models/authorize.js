const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Authorize extends Model {}
    return Authorize.init({

        name: {
            type: DataTypes.STRING
          },
          hash: {
            type: DataTypes.STRING
          },
          role: {
            type: DataTypes.STRING
          }

    }, {

        sequelize,
        modelName: 'authorize'
    });

};