// models/index.js

import Sequelize from "sequelize";
import sequelize from "../config/db.config.js"; // Adjust the path as needed

import User from "./User.js";
import Lobby from "./Lobby.js";
import LobbyUserIds from "./Lobby_userids.js";
import Sport from "./Sport.js";
import LobbyWinners from "./Lobby_winners.js";
import LobbyLosers from "./Lobby_losers.js";

// Define associations
User.hasMany(LobbyUserIds, { foreignKey: "userid" });
Lobby.hasMany(LobbyUserIds, { foreignKey: "lobbyid" });
LobbyUserIds.belongsTo(User, { foreignKey: "userid" });
LobbyUserIds.belongsTo(Lobby, { foreignKey: "lobbyid" });
Lobby.belongsTo(Sport, { foreignKey: "sportid" });

// Add associations for LobbyWinners
User.hasMany(LobbyWinners, { foreignKey: "userid" });
Lobby.hasMany(LobbyWinners, { foreignKey: "lobbyid" });
LobbyWinners.belongsTo(User, { foreignKey: "userid" });
LobbyWinners.belongsTo(Lobby, { foreignKey: "lobbyid" });
LobbyLosers.belongsTo(User, { foreignKey: "userid" });
LobbyLosers.belongsTo(Lobby, { foreignKey: "lobbyid" });

const db = {
  User,
  Lobby,
  LobbyUserIds,
  Sport,
  sequelize,
  LobbyWinners,
  LobbyLosers,
  Sequelize,
};

export default db;
