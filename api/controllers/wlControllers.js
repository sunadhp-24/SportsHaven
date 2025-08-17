import db from "../models/index.js";
import LobbyWinners from "../models/Lobby_winners.js";
import LobbyLosers from "../models/Lobby_losers.js";

export const getWinners = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const won = (await LobbyWinners.findAll({ where: { userid: userid } })).map(
      (lobby) => lobby.lobbyid
    );
    res.status(200).json(won);
  } catch (error) {
    next(error);
  }
};

export const getLosers = async (req, res, next) => {
  try {
    const { userid } = req.body;
    const lost = (await LobbyLosers.findAll({ where: { userid: userid } })).map(
      (lobby) => lobby.lobbyid
    );
    res.status(200).json(lost);
  } catch (error) {
    next(error);
  }
};
