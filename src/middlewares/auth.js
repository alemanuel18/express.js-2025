/**
 * @file middlewares/auth.js
 * @description Middleware to authenticate incoming requests via JWT tokens passed in the Authorization header.
 */

import pkg from 'jsonwebtoken';
const { verify } = pkg;

/**
 * Express middleware to validate JWT token from request header.
 * Attaches the decoded user payload to req.user if successful.
 * @function authenticateToken
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {import('express').Response|void} Returns HTTP response if unauthorized/forbidden, otherwise calls next().
 */
function authenticateToken(req, res, next) {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Forbidden', details: err.message });
		}
		req.user = user;
		next();
	});
}

export default authenticateToken;
