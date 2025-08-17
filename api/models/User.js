import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const User = sequelize.define('User', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  activelobby: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  currentlobby: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Lobby',  // Name of the referenced model
      key: 'lobbyid',  // Key in the referenced model
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_pic: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'users',  // Name of the table in the database
  timestamps: false,  // Disable createdAt and updatedAt columns
});

export default User;
