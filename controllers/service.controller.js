import mongoose from "mongoose";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";

const serviceController = {
    addServiceByAdmin: async (req, res) => {
        try {
            const user = await User.findById({_id:req.currentUser.id});
            console.log(req.currentUser.id)
            if (!user || user.role!='ADMIN') {
                return res.status(400).json({
                    status: false,
                    message: "User does not  Exist !You Are Not An Admin",
                    data: {}
                })
            }
            const { name, description } = req.body;
            const service = await Service.findOne({ name })
            if (service) {
                return res.status(400).json({
                    status: false,
                    message: "Service Already Exist",
                    data: {}
                })
            }
            const newService = new Service({
                name,
                description
            })
            await newService.save();
            return res.status(201).json({
                status: true,
                message: "Service created Successfully",
                data: newService
            })
        } catch (error) {
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            })
        }
    },

    getServiceById: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Id"
                })
            }
            const service = await Service.findById(req.params.id).populate('categories')
            if (!service) {
                return res.status(404).json({
                    status: false,
                    message: "Service Not exist With This Id"
                })
            }
            return res.status(200).json({
                status: false,
                message: "Servic Reterived Succcessfully",
                data: service
            })
        } catch (err) {
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            })
        }
    },

    getAllService: async (req, res) => {
        try {
            const services = await Service.find();
            return res.status(200).json({
                status: true,
                message: "Service retrived Successfully",
                totalServices:services.length,
                data: services
            })
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                error: err.message || "Internal Server Error"
            })
        }
    }
}


export default serviceController;