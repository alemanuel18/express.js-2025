/**
 * @file controllers/reservationController.js
 * @description Controllers handling exclusive reservations where conflict validation is global (exclusive time slots).
 */

import {
	getReservation_s,
	createReservation_s,
	updateReservation_s,
	deleteReservation_s,
} from '../services/reservationService.js';

/**
 * Creates a new exclusive reservation.
 * @async
 * @function createReservation_c
 * @param {import('express').Request} req - Express request object. Should contain date, timeBlockId, and userId in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 201 response with created reservation on success, or 400 on error.
 */
export const createReservation_c = async (req, res) => {
	console.log("🚀 ~ createReservation_c ~ req:", req.body)
	try {
		const reservation = await createReservation_s(req.body);
		return res.status(201).json(reservation);
	} catch (error) {
		console.log("🚀 ~ createReservation_c ~ error:", error)
		res.status(400).json({ message: 'Error creating reservation' });
	}
};

/**
 * Retrieves a reservation by ID.
 * @async
 * @function getReservation_c
 * @param {import('express').Request} req - Express request object. Should contain reservation ID in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 200 response with reservation details, or 404/500 on error.
 */
export const getReservation_c = async (req, res) => {
	try {
		const reservation = await getReservation_s(req.params.id);
		if (!reservation) {
			return res.status(404).json({ message: 'Reservation not found' });
		}
		return res.status(200).json(reservation);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving reservation' });
	}
};

/**
 * Updates a reservation by ID.
 * @async
 * @function updateReservation_c
 * @param {import('express').Request} req - Express request object. Should contain reservation ID in params and date/timeBlockId in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 200 response with updated reservation details, or 400/404 on error.
 */
export const updateReservation_c = async (req, res) => {
	try {
		const updatedReservation = await updateReservation_s(
			req.params.id,
			req.body
		);
		if (!updatedReservation) {
			return res.status(404).json({ message: 'Reservation not found' });
		}
		return res.status(200).json(updatedReservation);
	} catch (error) {
		res.status(400).json({ message: 'Error updating reservation' });
	}
};

/**
 * Deletes a reservation by ID.
 * @async
 * @function deleteReservation_c
 * @param {import('express').Request} req - Express request object. Should contain reservation ID in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 204 response on success, or 404/500 on error.
 */
export const deleteReservation_c = async (req, res) => {
	try {
		const deleted = await deleteReservation_s(req.params.id);
		if (!deleted) {
			return res.status(404).json({ message: 'Reservation not found' });
		}
		return res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Error deleting reservation' });
	}
};
