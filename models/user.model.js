import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';


dotenv.config()
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required:true
    },
    phoneNumber: {
        type: String,
        // unique:true
    },
    role: {
        type: String,
        enum: ['FINDWORKER', 'FINDWORK','ADMIN'],
        required: true,
    },
    password: {
        type: String
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        village: { type: String },
      },
    pinCode: {
        type: String
    },
    aadharCardNumber: {
        type: String,
        // unique:true
    },
    description: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    age: { type: String },
    image: {
        type: String
    },
    imageCaption: {
        type: String
    },
    imageAlt: {
        type: String
    },
    isAccountActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'Service'
    },
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }],
    isProfileCompleted:{
        type:Boolean,
        default:false
    },
    location: {
        latitude: Number,
        longitude: Number
    }
},
    {
        timestamps: true
    }
)


userSchema.methods.generateJwtToken = function () {
    jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, existingUser.password);
}


const User = mongoose.model('User', userSchema);

export default User;