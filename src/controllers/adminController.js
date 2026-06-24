/**
 * @file controllers/adminController.js
 * @description Controllers handling administrator requests such as creating time blocks and listing reservations.
 */

import {
	createTimeBlockService,
	listReservationsService,
} from '../services/adminService.js';

/**
 * Creates a new time block.
 * Requires admin role in the authenticated request user.
 * @async
 * @function createTimeBlock
 * @param {import('express').Request} req - Express request object. Should contain startTime and endTime in req.body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 201 response with the new time block on success, or 403/500 on failure.
 */
export const createTimeBlock = async (req, res) => {
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({ message: 'Forbidden' });
	}
	try {
		const { startTime, endTime } = req.body;
		const newTimeBlock = await createTimeBlockService(startTime, endTime);
		return res.status(201).json(newTimeBlock);
	} catch (error) {
		return res.status(500).json({ message: 'Error creating time block' });
	}
};

/**
 * Lists all reservations in the system.
 * Requires admin role in the authenticated request user.
 * @async
 * @function listReservations
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 200 response with list of reservations on success, or 403/500 on failure.
 */
export const listReservations = async (req, res) => {
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({ message: 'Forbidden' });
	}
	try {
		const reservations = await listReservationsService();
		return res.status(200).json(reservations);
	} catch (error) {
		return res.status(500).json({ message: 'Error listing reservations' });
	}
};
