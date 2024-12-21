import mongoose from "mongoose";
import Service from "../models/service.model.js";
import allServices from "../service/allservices.service.js";
import User from "../models/user.model.js";
import WorkPost from "../models/workPost.model.js";
import notificationService from "../service/notification.service.js";
import Category from "../models/categorymodel.js";
import categoryService from "../service/category.service.js";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 43200 });//12hr * 60 * 60sec
const serviceController = {
    postWorkByWorker: async (req, res) => {
        try {
            // User retrieval
            const existUser = await User.findById(req.currentUser.id);
            const { description, service, category, status, image, address } = req.body;
            if (existUser.role == 'FINDWORKER') {
                return res.status(400).json({
                    status: false,
                    message: `Only Those user can Post Which has FINDWORK role user can Post For Find Work`
                });
            }

            // Check if the service exists in the user's profile
            const existServiceInUserProfile = await allServices.serviceByname(service);
            if (!existServiceInUserProfile) {
                return res.status(400).json({
                    status: false,
                    message: "Service Not Exist With This Name"
                });
            }
            console.log(existUser)
            console.log("existUser.service ", existUser.service);
            console.log("existServiceInUserProfile._id", existServiceInUserProfile._id);
            // Check if the user can post for this service
            if (existUser.service.toString() !== existServiceInUserProfile._id.toString()) {
                return res.status(400).json({
                    status: false,
                    message: `You can't post work for this service because you are not registered by ${service} service account.`
                });
            }

            const existCategory = await categoryService.categoryByName(category);
            if (!existCategory) {
                return res.status(400).json({
                    status: false,
                    message: "Category Not Exist"
                });
            }
            if (!existServiceInUserProfile.categories.includes(existCategory._id)) {
                return res.status(400).json({
                    status: false,
                    message: `Category not belog to the ${existServiceInUserProfile.name} service`
                })
            }
            // Create a new work post
            const newPost = new WorkPost({
                description,
                userType: existUser.role,
                service,
                category,
                user: existUser._id,
                address,
                status,
                image,
            });

            await newPost.save();

            return res.status(201).json({
                status: true,
                message: `Post Uploaded Successfully By ${existUser.name} (${existUser.role})`,
                data: newPost
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    postByFindWorker: async (req, res) => {
        try {
            // User retrieval
            const existUser = await User.findById(req.currentUser.id);
            console.log(existUser.role)
            if (existUser.role == 'FINDWORK') {
                return res.status(400).json({
                    status: false,
                    message: `Only FINDWORKER can Post For Find Worker`
                });
            }

            const { description, requiredWorkers, availableFrom, service, category, image, location } = req.body;


            // Check if the service exists in the user's profile
            const existServiceInUserProfile = await allServices.serviceByname(service);
            if (!existServiceInUserProfile) {
                return res.status(400).json({
                    status: false,
                    message: "Service Not Exist With This Name"
                });
            }


            // Create a new work post
            const newPost = new WorkPost({
                description,
                requiredWorkers,
                availableFrom,
                userType: existUser.role,
                service, // Ensure the service is the ObjectId
                category,
                user: existUser._id,
                location,
                image,
            });

            await newPost.save();

            const users = await User.find({ service: existServiceInUserProfile._id });
            console.log("users", users);


            // Send notifications to all users related to the service
            await Promise.all(users.map(async (user) => {
                const body = {
                    from: req.currentUser.id,
                    to: user._id,
                    title: `Need For ${category}`,
                    description: `I want on an urgent basis. This is ${existUser.phoneNumber}. Contact me.`,
                };
                await notificationService.sendNotification(body);
            }));
            return res.status(201).json({
                status: true,
                message: `Post Uploaded Successfully By ${existUser.name} (${existUser.role})`,
                data: newPost
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    getAllPost: async (req, res) => {
        try {
            const cachedPosts = cache.get('posts');
            // cache.flushAll();
            if (cachedPosts) {
                console.log("chaching", cachedPosts.length)
                return res.status(200).json({
                    status: true,
                    totalPosts:cachedPosts.length,
                    data: cachedPosts
                })
            }
            const posts = await WorkPost.find().populate('user');

            // Convert Mongoose documents to plain objects
            const plainPosts = posts.map(post => post.toObject());
            console.log(plainPosts.length)
            // Cache the plain objects
            cache.set('posts', plainPosts);
            return res.status(200).json({
                status: true,
                totalPosts:posts.length,
                data: posts
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    getAllPostByToken: async (req, res) => {
        try {
            console.log("req.curectUser", req.currentUser);
            const post = await WorkPost.find({ user: req.currentUser.id }).populate('user');
            return res.status(200).json({
                status: true,
                data: post
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    getPostById: async (req, res) => {
        try {
            const post = await WorkPost.findById(req.params.id).populate('user');
            return res.status(200).json({
                status: true,
                data: post
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    findWorkerByPost: async (req, res) => {
        try {
            const post = await WorkPost.find({ status: 'AVAILABLE' }).populate('user');
            return res.status(200).json({
                status: true,
                data: post
            });
        } catch (err) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    changeStatusOfAvalabilityByWorker: async (req, res) => {
        try {
            const { status } = req.body;
            const statusEnum = ['AVAILABLE', 'NOTAVAILABLE'];
            if (!statusEnum.includes(status)) {
                return res.status(400).json({
                    status: false,
                    message: "Status Enum is Not Correct",
                })
            }
            const post = await WorkPost.findByid({ _id: req.params.id })
            post.status = status;
            await post.save();
            return res.status(200).json({
                status: true,
                message: "Status Updated Successfully",
                data: post
            });
        } catch (err) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    searchByName:async(req,res)=>{
        try {
            const { searchQuery } = req.query;
    
            if (!searchQuery) {
                return res.status(400).json({ message: "Search query is required" });
            }
    
            // Define the keys to search in
            const fieldsToSearch = ["userType", "description", "service", "category"];
    
            // Create the $or condition dynamically
            const searchConditions = fieldsToSearch.map(field => ({
                [field]: { $regex: searchQuery, $options: "i" } // Case-insensitive partial match
            }));
            console.log(searchConditions)
            // Perform the query
            const results = await WorkPost.find({ $or: searchConditions });
    
            if (results.length === 0) {
                return res.status(404).json({ message: "No results found" });
            }
    
            return res.status(200).json({ success: true, data: results });
        } catch (err) {
            console.error("Error in searchByName:", err);
            return res.status(500).json({ success: false, error: "Server error" });
        }
    }
}


export default serviceController;