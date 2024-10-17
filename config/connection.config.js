import mongoose from "mongoose";


const configConnnection = {
    connect:async()=>{
        try{
            await mongoose.connect(process.env.MONGO_URL);
            console.log(`DataBase Connected Successfully with DOWORK`)
        }catch(err){
            return res.status(500).json({
                status:false,
                error:"Internal Server Error"
            })
        }
    }
}


export default configConnnection;