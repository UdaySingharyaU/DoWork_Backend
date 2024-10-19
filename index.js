import express from 'express';
import dotenv from 'dotenv';
import configConnnection from './config/connection.config.js';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

//components
import userRoutes from './routes/user.routes.js';
import serviceRoutes from './routes/service.route.js';
import workRoutes from './routes/workPost.routes.js';
import messageRoutes from './routes/reveiw.route.js';
import reveiwRoutes from './routes/reveiw.route.js';



const app = express();
dotenv.config();

//Parse json request body
app.use(express.json());

// Sanitize data
app.use(xss());
app.use(mongoSanitize());

// Parsing cookie
app.use(cookieParser());

//routes
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API!');
  });
app.use('/api/v1/staging/user',userRoutes);
app.use('/api/v1/staging/service',serviceRoutes);
app.use('/api/v1/staging/post',workRoutes);
app.use('/api/v1/staging/message',messageRoutes);
app.use('/api/v1/staging/reveiw',reveiwRoutes);



//connection with DB
configConnnection.connect();
app.listen(process.env.PORT ,()=>{
    console.log(`Connection extablished at PORT ${process.env.PORT}`)
})


