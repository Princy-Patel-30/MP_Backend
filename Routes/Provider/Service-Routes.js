import express from 'express';
import {
  createService,
  getAllServices,
  getServicesByCompany,
  updateServiceStatus,
} from '../../Controllers/Providercontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('provider'));

/**
 * @swagger
 * /api/provider/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Provider Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               serviceTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               availability:
 *                 type: string
 *               providerContact:
 *                 type: string
 *               category:
 *                 type: string
 *               subCategory:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post('/', createService);

/**
 * @swagger
 * /api/provider/services:
 *   get:
 *     summary: Get all services for provider
 *     tags: [Provider Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', getAllServices);

/**
 * @swagger
 * /api/provider/services/{companyName}:
 *   get:
 *     summary: Get services by company name
 *     tags: [Provider Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services for the specified company
 */
router.get('/:companyName', getServicesByCompany);

/**
 * @swagger
 * /api/provider/services/{id}/{status}:
 *   put:
 *     summary: Update service status
 *     tags: [Provider Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service status updated
 */
router.put('/:id/:status', updateServiceStatus);

export default router;