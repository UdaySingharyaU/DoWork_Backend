import multer from 'multer';

// Configure multer with memory storage
const memoryStorage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // No larger than 20MB
    },
});

export default { memoryStorage };
