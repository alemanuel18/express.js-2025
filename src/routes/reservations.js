/**
 * @file routes/reservations.js
 * @description Defines reservation endpoints implementing exclusive time-slot rules.
 */

import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';
import {
	createReservation_c,
	deleteReservation_c,
	getReservation_c,
	updateReservation_c,
} from '../controllers/reservationController.js';

const router = Router();

/**
 * Route to create a new reservation.
 * @name POST /
 * @function
 * @middleware authenticateToken
 */
router.post('/', authenticateToken, createReservation_c);

/**
 * Route to get a reservation by ID.
 * @name GET /:id
 * @function
 * @middleware authenticateToken
 */
router.get('/:id', authenticateToken, getReservation_c);

/**
 * Route to update a reservation by ID.
 * @name PUT /:id
 * @function
 * @middleware authenticateToken
 */
router.put('/:id', authenticateToken, updateReservation_c);

/**
 * Route to delete a reservation by ID.
 * @name DELETE /:id
 * @function
 * @middleware authenticateToken
 */
router.delete('/:id', authenticateToken, deleteReservation_c);

export default router;
