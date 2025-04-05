// src/routes/purchaseRoutes.js
import express from 'express';
import { purchaseTickets } from '../controllers/purchaseController.js';

const router = express.Router();
router.post('/buy', purchaseTickets);
export default router;
