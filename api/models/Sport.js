// models/Sport.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Assuming sequelize configuration is in 'config/sequelize.js'

const Sport = sequelize.define('Sport', {
  sportid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  maxsize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currentsize: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
},
{
    tableName: 'sport', // Specify custom table name 'sport'
    timestamps: false // Disable createdAt and updatedAt columns
});

export default Sport;
