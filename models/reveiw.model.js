


import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config()
const reveiwSchema = new mongoose.Schema({
    forReveiw: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reveiwBody:[
        {
            name:String,
            description:String
        }
    ]
    
},
    {
        timestamps: true
    }
)



const Reveiw = mongoose.model('Reveiw', reveiwSchema);

export default Reveiw;