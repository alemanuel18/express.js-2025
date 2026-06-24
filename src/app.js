/**
 * @file app.js
 * @description Configures and initializes the Express application instance, loading middlewares and base routing.
 */

import express, { json, urlencoded } from 'express';
import routes from './routes/index.js';
import { LoggerMiddleware } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

/**
 * Express application instance.
 * @type {import('express').Express}
 */
const app = express();

// Global Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);

// API Routing Prefix
app.use('/api', routes);

/**
 * Root route handler to verify application health status.
 * @name GET /
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
app.get('/', (req, res) => {
	res.send('Hello World!');
});

export default app;
