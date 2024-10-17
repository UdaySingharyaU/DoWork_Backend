


import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';


dotenv.config()
const workPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userType: {
        type: String,
        enum: ['FINDWORKER', 'FINDWORK'],
        required: true
    },
    description: {
        type: String,
    },
    requiredWorkers: {
        type: Number,
    },
    service:{
        type:String
    },
    category:{
        type:String
    },
    availableFrom: {
        type: String,
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        village: { type: String },
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'NOTAVAILABLE'],
    },
    image:{
        type:String
    }
},
    {
        timestamps: true
    }
)



const WorkPost = mongoose.model('WorkPost', workPostSchema);

export default WorkPost;