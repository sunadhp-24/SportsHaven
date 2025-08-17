// models/LobbyWinners.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js'; // Adjust the path as needed

const LobbyWinners = sequelize.define('LobbyWinners', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lobbyid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lobby', // Reference to the Lobby model
      key: 'lobbyid',
    },
    onDelete: 'CASCADE',
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Reference to the User model
      key: 'userid',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'lobby_winners', // Name of the table in the database
  timestamps: false, // Disable createdAt and updatedAt columns
});

export default LobbyWinners;
