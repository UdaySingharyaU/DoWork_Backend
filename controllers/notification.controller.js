import Notification from "../models/notification.model.js";


const notificationController = {
    allNotification : async(req,res)=>{
        try{
            const userId = req.currentUser.id; 
            const notifications = await Notification.find({ from: { $ne: userId } }).populate('to').populate('from');
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