

import express from "express";

const router = express.Router();

//import components
import serviceController from "../controllers/service.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes
router.post('/addServiceByAdmin',authMiddleware.auth,authMiddleware.checkAdminOrNot,serviceController.addServiceByAdmin);

router.get('/getServiceById/:id',serviceController.getServiceById);


router.get('/getAllService',authMiddleware.auth,serviceController.getAllService);



export default router;