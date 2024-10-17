


import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';


dotenv.config()
const notificationSchema = new mongoose.Schema({
    to: {
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    from: {
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    description: {
        type: String,
    },
    title: {
        type: String,
    },
    
},
    {
        timestamps: true
    }
)

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;