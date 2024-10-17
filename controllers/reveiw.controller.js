import User from "../models/user.model.js";
import Reveiw from "../models/reveiw.model.js";
import mongoose from "mongoose";
import Rating from "../models/rating.model.js";


const serviceController = {
    addReveiw: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Ids"
                })
            }
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User Not Exist"
                })
            }
            let existReveiw = await Reveiw.findOne({forReveiw:req.params.id});
            console.log(existReveiw)
            if (existReveiw) {
                console.log("if")
                existReveiw.reveiwBody.push({
                        name: user.name,
                        description: req.body.description
                })
                console.log("existreve",existReveiw)
            }else{
                console.log("else")

                existReveiw = new Reveiw({
                    forReveiw: user._id,
                    reveiwBody: {
                        name: user.name,
                        description: req.body.description
                    }
                })
                console.log("existreve2",existReveiw)

            }
            await existReveiw.save();
            return res.status(200).json({
                status: true,
                message: "Reveiw Add Successfully",
                data: existReveiw
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    ratingForDoWorkApp:async(req,res)=>{
        try{
            const {ratingCount} = req.body;
            if(ratingCount>5){
                return res.status(400).json({
                    status:false,
                    message:"Rating Count Should be equal or less than 5"
                })
            }
            if(!ratingCount){
                return res.status(400).json({
                    status:false,
                    message:"Rating Count is Required"
                })
            }
            const user = await User.findById(req.currentUser.id);
            
            let existRating = await Rating.findOne({role:'RATING'})
            if(!existRating || existRating.usersGivesRating.length == 0){
                existRating = new Rating({
                    usersGivesRating:user._id,
                    rating:ratingCount
                })
            }else{
                let existRatingCount = existRating.rating;
                let secondFinalRateCount = existRatingCount+ratingCount
                const finalRatingCount = secondFinalRateCount/(existRating.usersGivesRating.length+1);
                existRating.usersGivesRating.push(user._id);
                existRating.rating=finalRatingCount
            }
            await existRating.save();
            return res.status(200).json({
                status: true,
                message: "Rating Add Successfully",
                data: existRating
            })
        }catch(error){
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    getRating:async(req,res)=>{
        try{
            let existRating = await Rating.findOne({role:'RATING'});
            if(!existRating){
                return res.status(404).json({
                    status:false,
                    message:"0 ratings",
                })
            }
            return res.status(200).json({
                status:true,
                message:"All Rating reterived Succesfully",
                data:existRating.rating
            })
        }catch(error){
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    }
}


export default serviceController;