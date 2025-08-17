// routes/sportRoutes.js

import express from 'express';
import {getSportDetailsByName,createSport, getSportByName, getAvlSports } from '../controllers/sportController.js';
import { verifyJwtToken } from '../middleware/verify.js';

const router = express.Router();

router.post('/', createSport);

// GET /api/sports/:name - Fetch sport details by name
router.get('/getsport/:name',verifyJwtToken, getSportByName);

router.get('/details/:name',verifyJwtToken, getSportDetailsByName);
router.get('/all', verifyJwtToken, getAvlSports);

export default router;
