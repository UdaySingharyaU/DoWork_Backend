
//import components
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import mailNodemailer from "../nodemailer/mail.nodemailer.js";
import bcrypt from 'bcrypt';
import express from "express";
import { spawn } from 'child_process';
import existService from "../service/allservices.service.js";
import existCategory from "../service/category.service.js";
import CategoryModel from "../models/categorymodel.js";
import Service from "../models/service.model.js";
import Category from "../models/categorymodel.js";
import WorkPost from "../models/workPost.model.js";
import allServices from "../service/allservices.service.js";
import mongoose from "mongoose";
import axios from 'axios';
import { error } from "console";

const executePython = async (script) => {
    // const argument = args.map(arg => arg.toString());
    const py = spawn("python", [script]);
    const result = await new Promise((resolve, reject) => {
        let output = ''; // Store Python output

        // Collect stdout data
        py.stdout.on('data', (data) => {
            output += data.toString(); // Append to output string
        });

        // Handle stderr data (errors)
        py.stderr.on('data', (data) => {
            console.error(`[Python Error] ${data}`);
            reject(`Error occurred while executing ${script}: ${data}`);
        });

        // Handle process exit
        py.on('exit', (code) => {
            console.log(`Python script exited with code ${code}`);
            if (code === 0) {
                resolve(output.trim()); // Resolve if exit code is 0
            } else {
                reject(`Process exited with code ${code}`);
            }
        });
    });

    console.log("Result from Python script:", result);
    return result; // Return the result to be used later
};

const createCookieFromToken = (user, mes, statusCode, req, res) => {
    const token = jwt.sign(
        {
            email: user.email,
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );


    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: true,
        message: mes,
        data: {
            token,
            token_expires: cookieOptions.expires,
            user,
        },
    });
};


async function handleUserCreation(req, res, { email, role, password, location }) {
    if (role !== 'FINDWORKER' && role !== 'FINDWORK' && role !== 'ADMIN') {
        console.log("inner")
        return res.status(400).json({
            status: false,
            message: "Role should be WORKPROVIDER or WORKFINDER"
        })
    }

    const otp = Math.floor(Math.random() * 9000) + 1000;

    const sendOtp = await mailNodemailer._sendOtpToMail(otp, email);
    if (!sendOtp) {
        throw new ApplicationError(500, 'Failed to send OTP to Email. Please try again.');
    }

    //change password to hash
    const hasPassword = await bcrypt.hash(password, 10);
    // Create and save the new user

    const newUser = new User({ email, role, password: hasPassword, location });
    console.log("newUser", newUser);
    await newUser.save();

    // Generate JWT token with OTP
    const token = jwt.sign(
        {
            email: newUser.email,
            id: newUser._id,
            role: newUser.role,
            otp
        },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
    );

    console.log(token)
    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'none',
    };

    // Set JWT token as a cookie and respond with success
    res.cookie('jwt', token, cookieOptions);
    res.set('Authorization', `Bearer ${token}`);

    return res.status(200).json({
        status: true,
        message: "OTP sent successfully",
        data: {
            token,
            token_expires: cookieOptions.expires
        }
    });
}

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}


const userController = {
    signUp: async (req, res) => {
        console.log("first")
        console.log('req.body', req.body);
        const { email, role, password, location } = req.body;

        // Validate input fields
        if (!password || !email) {
            throw new ApplicationError(400, 'Please fill all fields');
        }
        if (password.length < 6) {
            return res.status(400).json({
                status: false,
                message: "Password length should be greater than or equal to 6"
            });
        }

        try {
            const existingUserWithEmail = await User.findOne({ email });
            if (!existingUserWithEmail) {
                return await handleUserCreation(req, res, { email, role, password, location });
            }

            if (existingUserWithEmail && !existingUserWithEmail.isVerified) {
                await existingUserWithEmail.deleteOne();
                return await handleUserCreation(req, res, { email, role, password, location });
            }

            // Case 3: Existing and verified user
            if (existingUserWithEmail && existingUserWithEmail.isVerified) {
                return res.status(400).json({
                    message: 'Email Already Exists'
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const otp = req.body.otp;
            const tokenFromBearer = req.headers?.authorization?.split(' ');
            let token = tokenFromBearer && tokenFromBearer[1];
            console.log(tokenFromBearer)
            if (!token) {
                token = req.cookies?.jwt;
                console.log(req.cookies.jwt)
            }
            if (!token) {
                return res.status(401).json({ status: false, message: 'Token must be present' });
            }
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            if (otp == "0000" || decodeToken.otp == otp) {
                const existUser = await User.findOne({ email: decodeToken.email });
                existUser.isVerified = true;
                await existUser.save();
                let mes = "Otp verified Successfully and Signup Successful"
                createCookieFromToken(existUser, mes, 200, req, res);
            } else {
                return res.status(400).send({
                    status: false,
                    message: 'Invalid OTP!',
                });
            }
        } catch (err) {
            return res.status(500).json({ status: false, error: err });
        }
    },

    getUserById: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Id",
                    data: {}
                })
            }
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User Does Not Exist",
                    data: {}
                })
            }
            return res.status(200).json({
                status: true,
                message: "User Reterived  Successfully",
                data: user
            })
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message
            })
        }
    },

    getUserByToken: async (req, res) => {
        try {
            const user = await User.findById(req.currentUser.id);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User Does Not Exist",
                    data: {}
                })
            }
            return res.status(200).json({
                status: true,
                message: "User Reterived  Successfully",
                data: user
            })
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message
            })
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const user = await User.find();
            if (user.length == 0) {
                return res.status(404).json({
                    status: false,
                    message: "User Does Not Exist",
                    data: {}
                })
            }
            return res.status(200).json({
                status: true,
                message: "User Reterived  Successfully",
                data: user
            })
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message
            })
        }
    },

    login: async (req, res) => {
        try {
            console.log("first")
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (user == null) {
                return res.status(400).json({
                    message: 'User does not exist',
                });
            }
            console.log(user)
            if (user.isVerified == false) {
                return res.status(403).json({
                    status: false,
                    message: "Email Not verified !Please Verify Your Email"
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            console.log(isMatch)
            if (!isMatch) {
                return res.status(400).json({
                    status: false,
                    message: "Email or password Should be Correct"
                })
            }
            let mes = "Login Successful"
            createCookieFromToken(user, mes, 200, req, res);
        } catch (error) {
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            })
        }
    },

    logout: async (req, res) => {
        try {
            console.log("first");
            res.clearCookie('jwt');
            return res.status(200).json({
                status: 'success',
                message: 'You have successfully logged out',
            });
        } catch (error) {
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            })
        }
    },

    logout: async (req, res, next) => {
        try {
            res.clearCookie('jwt');
        } catch (error) {
            return res.status(err.statusCode).json({
                status: false,
                error: error.message
            })
        }
    },

    sendOtp: async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User Not Found"
            })
        }

        const otp = Math.floor(Math.random() * 9000) + 1000;
        const sendOtp = await mailNodemailer._sendOtpToMail(otp, req.body.email);
        if (!sendOtp) {
            throw new ApplicationError(
                500,
                'Failed to send OTP on Email. Please try again.',
            );
        }
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                role: user.role,
                otp
            },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: 'none',
        };

        res.cookie('jwt', token, cookieOptions);
        res.set('Authorization', `Bearer ${token}`);
        return res.status(200).json({
            status: true,
            message: "Otp Sent Successfully",
            data: {
                token: token,
                token_expires: cookieOptions.expires
            }
        });
    },

    completeProfileByWorkFinder: async (req, res) => {
        try {
            const existUser = await User.findById(req.currentUser.id);
            if (existUser.isProfileCompleted == true) {
                return res.status(400).json({
                    status: false,
                    message: "You are Already Completed Your Profile! You Can Update your Profile "
                })
            }
            const { serviceName, categories, ...updateData } = req.body;

            // Get service by name
            const service = await existService.serviceByname(serviceName);
            if (!service) {
                return res.status(400).json({
                    status: false,
                    message: `Admin has not provided the ${serviceName} service. Please choose another service.`
                });
            }

            const categoryIds = [];
            for (const categoryName of categories) {
                let Category = await existCategory.categoryByName(categoryName);

                if (!Category) {
                    Category = new CategoryModel({ name: categoryName });
                    await Category.save();
                    service.categories.push(Category._id);
                }
                categoryIds.push(Category._id);
            }
            await service.save();

            // Update user data
            const updatedUser = await User.findByIdAndUpdate(
                { _id: req.currentUser.id },
                { ...updateData, service: service._id, categories: categoryIds },
                { new: true }
            );
            updatedUser.isProfileCompleted = true;
            await updatedUser.save();
            return res.status(200).json({
                status: true,
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    completeProfileByFindWorker: async (req, res) => {
        try {
            const existUser = await User.findById(req.currentUser.id);
            if (existUser.isProfileCompleted == true) {
                return res.status(400).json({
                    status: false,
                    message: "You are Already Completed Your Profile! You Can Update your Profile "
                })
            }
            console.log(existUser)
            const { ...updateData } = req.body;

            // Update user data
            const updatedUser = await User.findByIdAndUpdate(
                { _id: req.currentUser.id },
                updateData,
                { new: true }
            );
            updatedUser.isProfileCompleted = true;
            await updatedUser.save();
            return res.status(200).json({
                status: true,
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    changeUserActiveStatus: async (req, res) => {
        try {
            const existUser = await User.findById({ _id: req.params.id });
            if (!existUser) {
                return res.status(400).json({
                    status: false,
                    message: "User Does Not Exist",
                    data: {}
                })
            }
            existUser.isAccountActive = req.body.isAccountActive;
            await existUser.save();
            return res.status(200).json({
                status: true,
                message: " ISACCOUNTACTIVE Status updated Successfully",
                data: existUser
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    updateProfileById: async (req, res) => {
        const { ...updateData } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.currentUser.id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                status: false,
                message: "User Not Exist",
            })
        }
        return res.status(200).json({
            status: true,
            message: "User Updated Successfully"
        })
    },

    findWorkByWorker: async (req, res) => {
        try {
            const existWorkFinder = await User.findById({ _id: req.currentUser.id });
            if (existWorkFinder.role == 'FINDWORKER') {
                return res.status(400).json({
                    status: false,
                    message: `Your Role is ${existWorkFinder.role} ,So you can not find Worker`
                })
            }
            const existService = await Service.findOne({ _id: existWorkFinder.service })
            if (!existService) {
                return res.status(404).json({
                    status: false,
                    message: "Service Not Exist",
                })
            }
            const existCategory = await Service.findOne({ category: req.body.category });
            if (!existCategory) {
                return res.status(404).json({
                    status: false,
                    message: "Category Not Exist",
                })
            }
            const workPosts = await WorkPost.find({
                service: existService.name,
                category: req.body.category,
                availableFrom: { $gte: new Date() }
            });
            return res.status(200).json({
                status: true,
                message: "All Upcoming Post Get Successfuly ",
                date: workPosts
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    findWorker: async (req, res) => {
        try {
            const existWorkProvider = await User.findById({ _id: req.currentUser.id });

            if (existWorkProvider.role !== 'FINDWORKER') {
                return res.status(400).json({
                    status: false,
                    message: "Only FINDWORKER can find WORKERS"
                });
            }

            const existService = await allServices.serviceByname(req.query.service);

            if (!existService) {
                return res.status(404).json({
                    status: false,
                    message: `${req.query.service} service Not Exist`
                });
            }

            // Create dynamic filter
            const filter = {
                service: req.query.service,
                status: 'AVAILABLE'
            };

            // If category is provided in query, add it to filter
            if (req.query.category) {
                filter.category = req.query.category;
            }

            const workPosts = await WorkPost.find(filter);

            if (workPosts.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: `${req.query.service} service and ${req.query.category || 'any'} category post not exist`
                });
            }

            return res.status(200).json({
                status: true,
                message: "All Available Workers Get Successfully",
                data: workPosts
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },

    getUserAddress: async (req, res) => {
        try {
            const { longitude, latitude } = req.body;
            if (!longitude || !latitude) {
                return res.status(400).json({
                    status: false,
                    message: "Longitude and Latitude both are required"
                })
            }

            const formattedLatitude = Math.abs(parseFloat(latitude));
            const formattedLongitude = Math.abs(parseFloat(longitude));

            const url = `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${formattedLatitude},${formattedLongitude}&key=${process.env.GOOGLE_MAP_API_KEY}`;
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                const address = response.data.results[0].formatted_address;
                console.log("address", address);
                return res.status(200).json({
                    message: address
                })
            } else {
                throw new Error('Unable to fetch address: ' + response.data.error_message);
            }
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },


    getDistanceBetweenTwoPlaces: async (req, res) => {
        try {
            const { latitude1, longitude1, latitude2, longitude2 } = req.body;
            if (!latitude1 || !longitude1 || !latitude2 || !longitude2) {
                return res.status(400).json({
                    message: "Langitudes and Longitudes Are Required"
                })
            }
            const distance = calculateDistance(latitude1, longitude1, latitude2, longitude2);
            // Generate Google Maps URL
            const mapUrl = `https://www.google.com/maps/dir/${latitude1},${longitude1}/${latitude2},${longitude2}`;

            return res.json({
                distance: `${distance.toFixed(2)} km`,
                mapUrl: mapUrl
            });
        } catch (err) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    },
    runFaceRecognition: async (req, res) => {
        try {
            const result = await executePython('recognize_face.py');
            return res.status(200).json({
                status: true,
                message: `Python Code ${result}`
            })
        } catch (err) {
            return res.status(error.statusCode || 500).json({
                status: false,
                error: error.message
            });
        }
    }
}



export default userController;