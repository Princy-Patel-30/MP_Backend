import express from 'express';
import {
  adminGetAllServices,
  updateServiceStatus,
  deleteService,
} from '../../Controllers/Admincontroller.js';
import { protect, restrictTo } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     summary: Get all services
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', adminGetAllServices);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   put:
 *     summary: Update service status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 enum: [Pending, Accepted, Rejected, Completed]
 *     responses:
 *       200:
 *         description: Service status updated
 */
router.put('/:id', updateServiceStatus);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 */
router.delete('/:id', deleteService);

export default router;