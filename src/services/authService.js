/**
 * @file services/authService.js
 * @description Provides authentication services such as password hashing, database registration, credential comparison, and JWT generation.
 */

import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Prisma Client instance extended with Accelerate.
 */
const prisma = new PrismaClient().$extends(withAccelerate());

/**
 * Hashes user password and saves user registration to the database with USER role.
 * @async
 * @function registerUser
 * @param {string} email - The email address of the user.
 * @param {string} password - The plain-text password of the user.
 * @param {string} name - The user's full name.
 * @returns {Promise<object>} The newly created user object.
 */
export const registerUser = async (email, password, name) => {
	const hashedPassword = await hash(password, 10);
	const newUser = await prisma.user.create({
		data: { email, password: hashedPassword, name, role: 'USER' },
	});
	return newUser;
};

/**
 * Validates user credentials and signs a JWT token valid for 4 hours.
 * @async
 * @function loginUser
 * @param {string} email - The user email.
 * @param {string} password - The plain-text password.
 * @returns {Promise<string>} The generated JWT token string.
 * @throws {Error} If credentials do not match or user is not found.
 */
export const loginUser = async (email, password) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error('Invalid email or password');
	}

	const isPasswordValid = await compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error('Invalid email or password');
	}

	const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: '4h',
	});
	return token;
};
