import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS
import configConnnection from './config/connection.config.js';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

//components
import userRoutes from './routes/user.routes.js';
import serviceRoutes from './routes/service.route.js';
import workRoutes from './routes/workPost.routes.js';
import messageRoutes from './routes/message.routes.js';
import reveiwRoutes from './routes/reveiw.route.js';
import uploadRoutes from './routes/upload.route.js';
import notificationRoutes from './routes/notification.route.js';
import categoryRoutes from './routes/category.routes.js';


const app = express();
dotenv.config();

// CORS Policy (Allow all origins)
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Sanitize data
app.use(xss());
app.use(mongoSanitize());

// Parsing cookie
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the DOWORK!');
});
app.use('/api/v1/staging/user', userRoutes);
app.use('/api/v1/staging/service', serviceRoutes);
app.use('/api/v1/staging/category', categoryRoutes);
app.use('/api/v1/staging/post', workRoutes);
app.use('/api/v1/staging/message', messageRoutes);
app.use('/api/v1/staging/reveiw', reveiwRoutes);
app.use('/api/v1/staging', uploadRoutes);
app.use('/api/v1/staging/notification', notificationRoutes);

// DB Connection
configConnnection.connect();

const PORT = process.env.CLIENT_URI || 3000;
app.listen(PORT, () => {
  console.log(`Connection established at PORT ${PORT}`);
});

export default app;
