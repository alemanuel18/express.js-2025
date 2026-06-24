/**
 * @file seed.js
 * @description Database seeding script. Populates the database with initial users, time blocks, and appointments for local development.
 */

import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma Client instance extended with Accelerate.
 */
const prisma = new PrismaClient().$extends(withAccelerate());

/**
 * Main seeding function that inserts seed records into the database.
 * @async
 * @function main
 * @returns {Promise<void>}
 */
async function main() {
	// Crear usuarios
	const user1 = await prisma.user.create({
		data: {
			email: 'user12@example.com',
			password: 'password123',
			name: 'User One',
			role: 'USER',
		},
	});

	const user2 = await prisma.user.create({
		data: {
			email: 'admin1@example.com',
			password: 'admin123',
			name: 'Admin User',
			role: 'ADMIN',
		},
	});

	// Crear bloques de tiempo
	const timeBlock1 = await prisma.timeBlock.create({
		data: {
			startTime: new Date('2023-10-01T09:00:00Z'),
			endTime: new Date('2023-10-01T10:00:00Z'),
		},
	});

	const timeBlock2 = await prisma.timeBlock.create({
		data: {
			startTime: new Date('2023-10-01T10:00:00Z'),
			endTime: new Date('2023-10-01T11:00:00Z'),
		},
	});

	// Crear citas
	await prisma.appointment.create({
		data: {
			date: new Date('2023-10-01T09:00:00Z'),
			user: { connect: { id: user1.id } },
			timeBlock: { connect: { id: timeBlock1.id } },
		},
	});

	await prisma.appointment.create({
		data: {
			date: new Date('2023-10-01T10:00:00Z'),
			user: { connect: { id: user2.id } },
			timeBlock: { connect: { id: timeBlock2.id } },
		},
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
