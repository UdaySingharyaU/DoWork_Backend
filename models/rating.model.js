


import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config()
const ratingSchema = new mongoose.Schema({
    usersGivesRating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    rating:{
        type:Number
    },
    role:{
        type:String,
        enum:['RATING'],
        default:'RATING'
    }
},
    {
        timestamps: true
    }
)



const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;