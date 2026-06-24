/**
 * @file services/adminService.js
 * @description Provides administration database services like time block creation and full reservation list retrieval.
 */

import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma Client instance extended with Accelerate.
 */
const prisma = new PrismaClient().$extends(withAccelerate());

/**
 * Creates a new time block resource in the database.
 * @async
 * @function createTimeBlockService
 * @param {string|Date} startTime - The start timestamp for the time block.
 * @param {string|Date} endTime - The end timestamp for the time block.
 * @returns {Promise<object>} The created TimeBlock database record.
 */
export const createTimeBlockService = async (startTime, endTime) => {
	const newTimeBlock = await prisma.timeBlock.create({
		data: {
			startTime: new Date(startTime),
			endTime: new Date(endTime),
		},
	});
	return newTimeBlock;
};

/**
 * Lists all appointments currently scheduled, including detailed user and timeBlock relations.
 * @async
 * @function listReservationsService
 * @returns {Promise<Array<object>>} Array of appointment records from the database.
 */
export const listReservationsService = async () => {
	const reservations = await prisma.appointment.findMany({
		include: {
			user: true,
			timeBlock: true,
		},
	});
	return reservations;
};
