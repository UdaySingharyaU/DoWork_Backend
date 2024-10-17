

import express from "express";

const router = express.Router();

//import components
import notificationController from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes
router.get('/getAllNotification',authMiddleware.auth,notificationController.allNotification);

export default router;