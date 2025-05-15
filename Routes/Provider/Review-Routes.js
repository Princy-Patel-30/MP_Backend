import express from 'express';
import { getProviderReviews } from '../../Controllers/Reviewcontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('provider'));

/**
 * @swagger
 * /api/provider/reviews:
 *   get:
 *     summary: Get provider reviews
 *     tags: [Provider Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/', getProviderReviews);

export default router;