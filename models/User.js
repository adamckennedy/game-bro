const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class User extends Model {}

User.init(
    {
        // define columns
        id: {
             type: DataTypes.INTEGER,
             allowNull: false,
             primaryKey: true,
             autoIncrement: true
            },
        
         username: {
             type: DataTypes.STRING,
             allowNull: false
         },
         email: {
             type: DataTypes.STRING,
             allowNull: false,
             unique: true,
             validate: {
                 isEmail: true
             }
         },
         twitch: {
             type: DataTypes.STRING,
             allowNull: true,
             unique: true,    
         },
         password: {
             type: DataTypes.STRING,
             allowNull: false,
             validate: {
                 len: [8]
             }
         }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
)

module.exports = User;