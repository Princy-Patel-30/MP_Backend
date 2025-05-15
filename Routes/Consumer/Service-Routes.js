import express from 'express';
import { getAllServices, getServicesByCompany } from '../../Controllers/Servicecontroller.js';

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Consumer Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: subCategory
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
router.get('/', getAllServices);

/**
 * @swagger
 * /api/services/company/{companyName}:
 *   get:
 *     summary: Get services by company name
 *     tags: [Consumer Services]
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
router.get('/company/:companyName', getServicesByCompany);

export default router;