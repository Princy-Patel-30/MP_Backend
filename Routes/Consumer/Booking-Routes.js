import express from 'express';
import { createBooking, getUserBookings } from '../../Controllers/bookingcontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('consumer'));

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Consumer Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               googleAccessToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/', createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get user bookings
 *     tags: [Consumer Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', getUserBookings);

export default router;