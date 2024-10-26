

import express from "express";

const router = express.Router();

//import components
import workPost from "../controllers/workPost.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes
router.post('/postByWorker',authMiddleware.auth,workPost.postWorkByWorker);

router.post('/postByFindWorker',authMiddleware.auth,workPost.postByFindWorker);

router.get('/getAllPost',authMiddleware.auth,workPost.getAllPost);

router.get('/getPostById/:id',authMiddleware.auth,workPost.getPostById);

router.get('/getAllPostByToken',authMiddleware.auth,workPost.getAllPostByToken);


router.patch('/changeStatusOfAvalabilityByWorker/:id',authMiddleware.auth,workPost.changeStatusOfAvalabilityByWorker);

export default router;