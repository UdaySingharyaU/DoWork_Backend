

import express from "express";

const router = express.Router();

//import components
import reveiwController from "../controllers/reveiw.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes
router.post('/addReveiw/:id',authMiddleware.auth,reveiwController.addReveiw);

router.post('/ratingForDoWorkApp',authMiddleware.auth,reveiwController.ratingForDoWorkApp);

router.get('/getAllRating',reveiwController.getRating);


export default router;