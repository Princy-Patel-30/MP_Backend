import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';
import adminRoutes from './Routes/Admin/User-Routes.js';
import adminServiceRoutes from './Routes/Admin/Service-Routes.js';
import providerServiceRoutes from './Routes/Provider/Service-Routes.js';
import providerBookingRoutes from './Routes/Provider/Booking-Routes.js';
import providerProfileRoutes from './Routes/Provider/Profile-Routes.js';
import providerReviewRoutes from './Routes/Provider/Review-Routes.js';
import userProfileRoutes from './Routes/Consumer/Profile-Routes.js';
import serviceRoutes from './Routes/Consumer/Service-Routes.js';
import bookingRoutes from './Routes/Consumer/Booking-Routes.js';
import reviewRoutes from './Routes/Consumer/Review-Routes.js';
import errorHandler from './Middleware/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './Config/Swagger.js';
import performanceMiddleware from './Middleware/performanceMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(performanceMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/services', adminServiceRoutes);
app.use('/api/provider/services', providerServiceRoutes);
app.use('/api/provider/bookings', providerBookingRoutes);
app.use('/api/provider/profile', providerProfileRoutes);
app.use('/api/provider/reviews', providerReviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

export default app;