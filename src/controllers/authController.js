/**
 * @file controllers/authController.js
 * @description Controllers handling authentication requests such as user registration and login.
 */

import { registerUser, loginUser } from '../services/authService.js';

/**
 * Registers a new user.
 * @async
 * @function register
 * @param {import('express').Request} req - Express request object. Should contain email, password, and name in req.body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 201 response on success, or 400 response on error.
 */
export const register = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		await registerUser(email, password, name);
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

/**
 * Logins a user and issues a JWT token.
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object. Should contain email and password in req.body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<import('express').Response>} HTTP 200 response with token on success, or 401 response on invalid credentials.
 */
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const token = await loginUser(email, password);
		res.status(200).json({ token });
	} catch (error) {
		return res.status(401).json({ error: error.message });
	}
};
