


import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';


dotenv.config()
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
)



const Category = mongoose.model('Category', categorySchema);

export default Category;