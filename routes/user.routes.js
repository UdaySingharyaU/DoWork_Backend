import express from "express";

const router = express.Router();

//import components
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes

router.post('/signUp',userController.signUp);

router.post('/login',userController.login);

router.post('/sendOtp',userController.sendOtp);

router.post('/verifyOtp',userController.verifyOtp);

router.get('/getUserById/:id',authMiddleware.auth,userController.getUserById);

router.get('/getUserByToken/:id',authMiddleware.auth,userController.getUserByToken);

router.get('/getAllUsers',authMiddleware.auth,authMiddleware.checkAdminOrNot,userController.getAllUsers);

router.post('/completeProfileByWorkFinder',authMiddleware.auth,userController.completeProfileByWorkFinder);

router.post('/completeProfileByFindWorker',authMiddleware.auth,userController.completeProfileByFindWorker);

router.patch('/changeUserActiveStatus',authMiddleware.auth,userController.changeUserActiveStatus);

router.patch('/updateProfileById/:id',authMiddleware.auth,userController.updateProfileById);

router.get('/findWorkByWorker',authMiddleware.auth,userController.findWorkByWorker)

router.get('/findWorker',authMiddleware.auth,userController.findWorker)







router.get('/runFaceRecognition',userController.runFaceRecognition);


export default router;