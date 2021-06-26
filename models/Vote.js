const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Vote extends Model {}

Vote.init(
    {
        // define columns
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        vote: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote',
    }
);

module.exports = Vote;