/**
 * @file services/reservationService.js
 * @description Provides database services for managing exclusive reservations, applying global conflict rules (one reservation per block/date).
 */

import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma Client instance extended with Accelerate.
 */
const prisma = new PrismaClient().$extends(withAccelerate());

/**
 * Creates a new reservation. Validates that no other reservation exists at the same date and timeBlockId (global exclusivity).
 * @async
 * @function createReservation_s
 * @param {object} data - Object containing date, timeBlockId, and userId.
 * @param {string} data.date - The date of the reservation.
 * @param {number} data.timeBlockId - The associated time block ID.
 * @param {number} data.userId - The user ID making the reservation.
 * @returns {Promise<object>} The created Appointment database record.
 * @throws {Error} If the slot is already booked.
 */
export const createReservation_s = async (data) => {
	const conflict = await prisma.appointment.findFirst({
		where: {
			date: data.date,
			timeBlockId: data.timeBlockId,
		},
	});

	if (conflict) {
		throw new Error('Time slot already booked');
	}
	return await prisma.appointment.create({ data });
};

/**
 * Retrieves a reservation by ID.
 * @async
 * @function getReservation_s
 * @param {string|number} id - The reservation ID.
 * @returns {Promise<object|null>} The Appointment database record, or null if not found.
 */
export const getReservation_s = async (id) => {
	return await prisma.appointment.findUnique({
		where: { id: parseInt(id, 10) },
	});
};

/**
 * Updates a reservation. Validates that the new date and timeBlockId does not conflict globally.
 * @async
 * @function updateReservation_s
 * @param {string|number} id - The ID of the reservation to update.
 * @param {object} data - The updated reservation values (date, timeBlockId).
 * @returns {Promise<object>} The updated Appointment record.
 * @throws {Error} If slot is already booked.
 */
export const updateReservation_s = async (id, data) => {
	const conflict = await prisma.appointment.findFirst({
		where: {
			date: data.date,
			timeBlockId: data.timeBlockId,
			id: { not: parseInt(id, 10) },
		},
	});
	if (conflict) {
		throw new Error('Time slot already booked');
	}
	return await prisma.appointment.update({
		where: { id: parseInt(id, 10) },
		data,
	});
};

/**
 * Deletes/cancels a reservation by ID.
 * @async
 * @function deleteReservation_s
 * @param {string|number} id - The ID of the reservation to delete.
 * @returns {Promise<object>} The deleted Appointment record.
 */
export const deleteReservation_s = async (id) => {
	return await prisma.appointment.delete({
		where: { id: parseInt(id, 10) },
	});
};
