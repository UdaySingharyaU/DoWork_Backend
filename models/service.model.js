
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';


dotenv.config()
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Referencing categories
    }]
},
    {
        timestamps: true
    }
)



const Service = mongoose.model('Service', serviceSchema);

export default Service;