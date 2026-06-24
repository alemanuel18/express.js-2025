/**
 * @file routes/admin.js
 * @description Routes for administration tasks like managing time blocks and viewing all reservations.
 */

import { Router } from 'express';
import {
	createTimeBlock,
	listReservations,
} from '../controllers/adminController.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * Route to create a new time block.
 * Requires administrator role in the token.
 * @name POST /time-block
 * @function
 * @middleware authenticateToken
 */
router.post('/time-block', authenticateToken, createTimeBlock);

/**
 * Route to list all reservations/appointments.
 * Requires administrator role in the token.
 * @name GET /reservations
 * @function
 * @middleware authenticateToken
 */
router.get('/reservations', authenticateToken, listReservations);

export default router;
