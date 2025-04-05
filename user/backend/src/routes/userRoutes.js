// src/routes/userRoutes.js

import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
//   getUserProfile
} from '../controllers/userController.js';

// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// // Get user profile (protected route)
// router.get('/profile', getUserProfile);

export default router;
