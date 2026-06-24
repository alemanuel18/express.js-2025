/**
 * @file controllers/appointmentController.js
 * @description Controllers handling user-specific appointments requests where conflict validation is at the user level.
 */

import {
	createAppointment_s,
	deleteAppointment_s,
	getUserAppointments,
	updateAppointment_s,
} from '../services/appointmentService.js';

/**
 * Creates a new appointment for a user.
 * @async
 * @function createAppointment_c
 * @param {import('express').Request} req - Express request object. Should contain user id in params, and date and timeBlockId in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 201 response with created appointment on success.
 * @throws {Error} If appointment creation fails.
 */
export const createAppointment_c = async (req, res) => {
	try {
		const userId = req.params.id;
		const appointment = await createAppointment_s(userId, req.body);
		return res.status(201).json(appointment);
	} catch (error) {
		throw new Error('Error creating appointment');
	}
};

/**
 * Lists all appointments for a user.
 * @async
 * @function listAppointments_c
 * @param {import('express').Request} req - Express request object. Should contain user id in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 200 response with list of user appointments on success, or 500 response on failure.
 */
export const listAppointments_c = async (req, res) => {
	try {
		const userId = req.params.id;
		const appointments = await getUserAppointments(userId);
		return res.status(200).json(appointments);
	} catch (error) {
		return res.status(500).json({ message: 'Error retrieving appointments' });
	}
};

/**
 * Updates an appointment for a user.
 * @async
 * @function updateAppointment_c
 * @param {import('express').Request} req - Express request object. Should contain appointmentId in params and new date/timeBlockId in body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 200 response with updated appointment on success.
 * @throws {Error} If appointment updating fails.
 */
export const updateAppointment_c = async (req, res) => {
	try {
		const { appointmentId } = req.params;
		const updatedAppointment = await updateAppointment_s(
			appointmentId,
			req.body
		);
		return res.status(200).json(updatedAppointment);
	} catch (error) {
		throw new Error('Error updating appointment');
	}
};

/**
 * Deletes an appointment for a user.
 * @async
 * @function deleteAppointment_c
 * @param {import('express').Request} req - Express request object. Should contain appointmentId in params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 204 response on success.
 * @throws {Error} If appointment deletion fails.
 */
export const deleteAppointment_c = async (req, res) => {
	try {
		const { appointmentId } = req.params;
		await deleteAppointment_s(appointmentId);
		return res.status(204).send();
	} catch (error) {
		throw new Error('Error deleting appointment');
	}
};
