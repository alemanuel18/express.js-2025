/**
 * @file middlewares/logger.js
 * @description Logger middleware that prints HTTP request method, URL, client IP, response status code, and process duration.
 */

/**
 * Express middleware for logging incoming requests and recording response times.
 * @function LoggerMiddleware
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
export const LoggerMiddleware = (req, res, next) => {
	const timestamp = new Date().toLocaleString();

	console.log(`[${timestamp} ${req.method} ${req.url}] - IP: ${req.ip}`);

	const start = Date.now();

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(
			`[${timestamp} ${req.method} ${req.url}] - Status: ${res.statusCode} - Duration: ${duration}ms`
		);
	});

	next();
};
