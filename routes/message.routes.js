



import express from "express";

const router = express.Router();

//import components
import messageController from "../controllers/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


//routes
router.post('/sendMessageFromuUser/:receiverId',authMiddleware.auth,messageController._sendMessageFromuUser);

router.get('/chatHistoryBetweenTwoUser/:frontUserId',authMiddleware.auth,messageController._chatHistoryBetweenTwoUser);

router.post('/messageFromAdminToUser/:receiverId',authMiddleware.auth,authMiddleware.checkAdminOrNot,messageController._chatFromAdminToUser);

router.post('/messageFromUserToAdmin',authMiddleware.auth,messageController._messageFromUserToAdmin);

router.get('/chatHistoryFromUserToAdmin',authMiddleware.auth,messageController._chatHistoryFromUserToAdmin);


export default router;