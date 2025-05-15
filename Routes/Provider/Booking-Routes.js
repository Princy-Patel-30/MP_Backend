import express from 'express';
import { getProviderBookings, updateBookingStatus } from '../../Controllers/bookingcontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('provider'));

/**
 * @swagger
 * /api/provider/bookings:
 *   get:
 *     summary: Get provider bookings
 *     tags: [Provider Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', getProviderBookings);

/**
 * @swagger
 * /api/provider/bookings/{bookingId}:
 *   patch:
 *     summary: Update booking status
 *     tags: [Provider Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated
 */
router.patch('/:bookingId', updateBookingStatus);

export default router;