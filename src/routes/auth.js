/**
 * @file routes/auth.js
 * @description Defines authentication routes such as register, login, and protected route testing.
 */

import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * Route to register a new user.
 * @name POST /register
 * @function
 */
router.post('/register', register);

/**
 * Route to authenticate a user and obtain a JWT.
 * @name POST /login
 * @function
 */
router.post('/login', login);

/**
 * Route to verify token-based authorization.
 * @name GET /protected-route
 * @function
 * @middleware authenticateToken
 */
router.get('/protected-route', authenticateToken, (req, res) => {
	res.json({ message: 'This is a protected route' });
});

export default router;
