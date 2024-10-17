import Notification from "../models/notification.model.js";

const notificationService = {
    sendNotification:async(body)=>{
        const {to,from,title,description}=body;
        const newNotification = new Notification({
            to,
            from,
            title,
            description
        })
        await newNotification.save();
        return {
            status:true,
            message:"Notification sent Successfully",
        }
    },
}


export default notificationService;