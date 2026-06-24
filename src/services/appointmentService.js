/**
 * @file services/appointmentService.js
 * @description Provides database services for managing user-specific appointments, applying user-level conflict logic.
 */

import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma Client instance extended with Accelerate.
 */
const prisma = new PrismaClient().$extends(withAccelerate());

/**
 * Creates a new appointment for a user. Validates that the user does not have a conflicting appointment at the same block and date.
 * @async
 * @function createAppointment_s
 * @param {string|number} userId - The user ID scheduling the appointment.
 * @param {object} data - Object containing date and timeBlockId.
 * @param {string} data.date - The date of the appointment.
 * @param {number} data.timeBlockId - The associated time block ID.
 * @returns {Promise<object>} The created Appointment database record.
 * @throws {Error} If there is a scheduling conflict for the user or query fails.
 */
export const createAppointment_s = async (userId, data) => {
	try {
		const conflict = await prisma.appointment.findFirst({
			where: {
				date: data.date,
				timeBlockId: data.timeBlockId,
				userId: parseInt(userId, 10),
			},
		});
		if (conflict) {
			throw new Error('Appointment conflict');
		}
		return prisma.appointment.create({
			data: {
				...data,
				userId: parseInt(userId, 10),
			},
		});
	} catch (error) {
		console.log('🚀 ~ createAppointment_s ~ error:', error);
		throw new Error('Error creating appointment');
	}
};

/**
 * Retrieves all appointments for a specific user, including timeBlock details.
 * @async
 * @function getUserAppointments
 * @param {string|number} userId - The user ID.
 * @returns {Promise<Array<object>>} Array of user appointment records.
 * @throws {Error} If database query fails.
 */
export const getUserAppointments = async (userId) => {
	try {
		const appointments = await prisma.appointment.findMany({
			where: { userId: parseInt(userId) },
			include: {
				timeBlock: true,
			},
		});
		return appointments;
	} catch (error) {
		throw new Error('Error retrieving appointments');
	}
};

/**
 * Updates an appointment date or block, ensuring no self-conflict for the user.
 * @async
 * @function updateAppointment_s
 * @param {string|number} appointmentId - The ID of the appointment to update.
 * @param {object} data - Updated appointment values (date, timeBlockId).
 * @returns {Promise<object>} The updated Appointment record.
 * @throws {Error} If updating fails or a conflict is found.
 */
export const updateAppointment_s = async (appointmentId, data) => {
	try {
		const conflict = await prisma.appointment.findFirst({
			where: {
				date: data.date,
				timeBlockId: data.timeBlockId,
				id: { not: parseInt(appointmentId, 10) },
			},
		});
		if (conflict) {
			throw new Error('Appointment conflict');
		}
		return prisma.appointment.update({
			where: { id: parseInt(appointmentId, 10) },
			data,
		});
	} catch (error) {
		throw new Error('Error updating appointment');
	}
};

/**
 * Deletes/cancels a user appointment by ID.
 * @async
 * @function deleteAppointment_s
 * @param {string|number} appointmentId - The ID of the appointment to delete.
 * @returns {Promise<object>} The deleted Appointment database record.
 * @throws {Error} If deletion fails.
 */
export const deleteAppointment_s = async (appointmentId) => {
	try {
		return prisma.appointment.delete({
			where: { id: parseInt(appointmentId, 10) },
		});
	} catch (error) {
		throw new Error('Error deleting appointment');
	}
};
