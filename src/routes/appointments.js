/**
 * @file routes/appointments.js
 * @description Defines user-specific appointment endpoints where conflict checks are evaluated per user.
 */

import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';
import {
	updateAppointment_c,
	deleteAppointment_c,
	createAppointment_c,
	listAppointments_c,
} from '../controllers/appointmentController.js';

const router = Router();

/**
 * Route to list all appointments for a specific user.
 * @name GET /:id/appointments
 * @function
 * @middleware authenticateToken
 */
router.get('/:id/appointments', authenticateToken, listAppointments_c);

/**
 * Route to create a new appointment for a specific user.
 * @name POST /:id/appointments
 * @function
 * @middleware authenticateToken
 */
router.post('/:id/appointments', authenticateToken, createAppointment_c);

/**
 * Route to update an appointment for a specific user.
 * @name PUT /:id/appointments/:appointmentId
 * @function
 * @middleware authenticateToken
 */
router.put(
	'/:id/appointments/:appointmentId',
	authenticateToken,
	updateAppointment_c
);

/**
 * Route to delete an appointment for a specific user.
 * @name DELETE /:id/appointments/:appointmentId
 * @function
 * @middleware authenticateToken
 */
router.delete(
	'/:id/appointments/:appointmentId',
	authenticateToken,
	deleteAppointment_c
);

export default router;
