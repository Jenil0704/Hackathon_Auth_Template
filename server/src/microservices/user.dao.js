import User from '../models/User.js';
import crypto from 'crypto'
export const findUserByEmail = async(email) => {
    return await User.findOne({email});
}

export const findUserByEmailAndPassword = async(email) => {
    return await User.findOne({email});
}

export const findUserById = async(id) => {
    return await User.findById(id);
}


export const createUser = async(name,email,password) => {
    // const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    // const otpExpires = Date.now() + 5 * 60 * 1000; // expires in 5 minutes

    const newUser = new User({
        name,
        email,
        password,
        isVerified : true
        // otp,
        // otpExpires
    });
    
    return await newUser.save();
}


