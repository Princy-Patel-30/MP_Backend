import express from 'express';
import { getProviderProfile, updateProviderProfile } from '../../Controllers/Providercontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('provider'));

/**
 * @swagger
 * /api/provider/profile:
 *   get:
 *     summary: Get provider profile
 *     tags: [Provider Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider profile data
 */
router.get('/', getProviderProfile);

/**
 * @swagger
 * /api/provider/profile:
 *   put:
 *     summary: Update provider profile
 *     tags: [Provider Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/', updateProviderProfile);

export default router;