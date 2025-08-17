// routes/lobby.routes.js

import express from "express";
import {
  createLobby,
  enterLobby,
  getActiveLobbies,
  getAllLobbyUsers,
  getPending,
  getUpdatedLobbies,
  exitLobby,
  updateLobby,
  addToLobby,
  updateWinnersAndLosers,
} from "../controllers/lobbyController.js";
import { verifyJwtToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/", verifyJwtToken, createLobby);
router.put("/enter/:lobbyid", verifyJwtToken, enterLobby);
router.put("/adduser/:lobbyid", verifyJwtToken, addToLobby);
router.get("/getactive", verifyJwtToken, getActiveLobbies);
router.get("/getpending", verifyJwtToken, getPending);
router.put("/updateWinners/:lobbyid", verifyJwtToken, updateWinnersAndLosers);
router.put("/update/:lobbyid", verifyJwtToken, updateLobby);
router.get("/getupdated", verifyJwtToken, getUpdatedLobbies);
router.get("/lobbyusers/:lobbyid", verifyJwtToken, getAllLobbyUsers);
router.put("/exit", verifyJwtToken, exitLobby);

export default router;
