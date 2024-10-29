import Notification from "../models/notification.model.js";


const notificationController = {
    allNotification : async(req,res)=>{
        try{
            const notifications = await Notification.find().populate('to').populate('from');
            return res.status(200).json({
                status:true,
                message:"All Notifications get Successfully",
                data:notifications
            })
        }catch(error){
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            }) 
        }
    }
}

export default notificationController;