/**
 * @file middlewares/errorHandler.js
 * @description Centralized error handler middleware. Captures thrown errors and sends structured JSON responses.
 */

/**
 * Express error-handling middleware. Handles all application errors, logs details, and outputs JSON response.
 * @function errorHandler
 * @param {Error & {statusCode?: number}} err - The error object, optionally containing a statusCode property.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';

	console.error(
		`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`
	);

	if (err.stack) {
		console.error(err.stack);
	}

	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message,
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
};

