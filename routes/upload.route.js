import express from 'express';

const router = express.Router();

import  uploadMiddleware  from '../middleware/upload.middleware.js';
import uploadController from '../controllers/upload.controller.js';

router.post('/uploadImage',uploadMiddleware.memoryStorage.single('file') ,uploadController.uploadImage);

export default router;