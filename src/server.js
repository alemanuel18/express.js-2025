/**
 * @file server.js
 * @description Entry point of the application. Starts the Express server listening on the configured port.
 * @author Miguel Reyes <miguelreyesmoreno@hotmail.com>
 * @license MIT
 */

import app from './app.js';

/**
 * Port number on which the Express server will listen.
 * Defaults to 3000 if the PORT environment variable is not defined.
 * @type {number|string}
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('working app on http://localhost:' + PORT);
});
