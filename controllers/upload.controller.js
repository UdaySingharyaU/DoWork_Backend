
import uploadByCloudinaryService from "../service/upload/uploadByCloudinary.service.js";

const uploadController={
    uploadImage: async (req, res) => {
        try {
            console.log("req.file",req.file);
            const imageUrlsArray = await uploadByCloudinaryService.uploadImageUsingUploadStream(req.file);
            res.status(200).json(imageUrlsArray);
        } catch (error) {
            return res.status(error.status).json({
                message:error.message
            })
        }
    },
}


export default uploadController;