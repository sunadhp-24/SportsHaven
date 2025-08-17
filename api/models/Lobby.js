// models/Lobby.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Assuming sequelize configuration is in 'config/sequelize.js'

const Lobby = sequelize.define('Lobby', {
  lobbyid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sportid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sport', // Reference to Sport model
      key: 'sportid'
    }
  },
  maxsize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currentsize: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isupdated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  winner: {
    type: DataTypes.STRING(255)
  },
  score: {
    type: DataTypes.STRING(255)
  }
}, 
{
    tableName: 'lobby', // Specify custom table name 'lobbies'
    timestamps: false // Disable createdAt and updatedAt columns
});

export default Lobby;
