const {
    Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Kwh extends Model {}
    return Kwh.init({

        pulses: {
            type: DataTypes.INTEGER,
        },

    }, {

        sequelize,
        modelName: 'Kwh'
    });

};