

import cloudinary from '../../config/cloudinaryConfig.js';

const uploadByCloudinaryService = {
    uploadImageUsingUploadStream: async (file) => {
        if (!file) {
            throw new ApplicationError(400, "file is required");
        }
        const Image = file.originalname.split('.').slice(0, -1).join('.');
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (err, result) => {
                        if (err) {
                            console.error('Error uploading to Cloudinary:', err);
                            reject({ error: 'Error uploading to Cloudinary' });
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(file.buffer);
            });

            const imageUrl = result.secure_url;
            return { imageUrl: imageUrl, imageName: Image };
        } catch (error) {
            return res.status(error.status).json({
                message:error.message
            })
        }
    },
}

export default uploadByCloudinaryService;