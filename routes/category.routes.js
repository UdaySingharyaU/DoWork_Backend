

import express from "express";

const router = express.Router();

//import components
import categoryController from "../controllers/category.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes
router.post('/addCategory',authMiddleware.auth,categoryController.addCategory);

router.post('/getCategoryById/:id',categoryController.getCategoryById);

router.get('/getAllCategory',authMiddleware.auth,categoryController.getAllCategory);




export default router;