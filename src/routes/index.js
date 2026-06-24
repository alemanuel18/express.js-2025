/**
 * @file routes/index.js
 * @description Main router that aggregates and prefixes all sub-routers (auth, admin, reservations, users) for the application.
 */

import { Router } from 'express';
import authRouter from './auth.js';
import adminRouter from './admin.js';
import reservations from './reservations.js';
import appointments from './appointments.js';

const router = Router();

// Sub-routers mounting
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/reservations', reservations);
router.use('/users', appointments);

export default router;
