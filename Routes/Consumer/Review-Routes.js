import express from 'express';
import { createReview, getReviewsByService } from '../../Controllers/Reviewcontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Consumer Reviews]
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
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added
 */
router.post('/', protect, restrictTo('consumer'), createReview);

/**
 * @swagger
 * /api/reviews/{serviceId}:
 *   get:
 *     summary: Get reviews by service
 *     tags: [Consumer Reviews]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/:serviceId', getReviewsByService);

export default router;