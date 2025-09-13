import { findUserByEmail, findUserByEmailAndPassword, createUser } from "../microservices/user.dao.js";
import User from "../models/User.js";
import { signToken } from "../utils/helper.js";
import crypto from 'crypto'
import {sendMail} from "../utils/mailer.js"; // your nodemailer setup
import bcrypt from 'bcrypt';


export const registerUser = async(name,email,password) => {
    const user = await findUserByEmail(email);
    if(user) throw Error('User already exists');
    
    const newUser = await createUser(name,email,password);
    const otp = newUser.otp;
    const token = signToken({id : newUser._id});
    return {token, user: newUser, otp};
}

export const loginUser = async(email,password) => {
    console.log("Login attempt for email:", email);
    
    const user = await User.findOne({ email }).select("+password"); // fetch password
    console.log("User fetched:", user);
    
    if(!user){
        console.log('User not found with this email');
        throw new Error('Invalid credentials');
    }

    try{
        console.log("Entered password:", password);
        console.log("Stored hash:", user.password);
        
        const isPasswordValid = await user.comparePassword(password);
        console.log("Password validation result: ", isPasswordValid);

        if(!isPasswordValid){
            throw new Error("Invalid Email or Password");
        }

        const token = signToken({id : user._id});
        console.log("Generated token:", token);
        console.log("User found:", user);
        
        return {token, user};
    }
    catch(error){
        console.error("Password comparison error", error);
        throw new Error("Invalid email or password");
    }
}

export const forgot_password = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { success: false, message: "User not found" };

  const otp = crypto.randomInt(100000, 999999).toString();
  user.resetOtp = otp;
  user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry
  await user.save();

  await sendMail(
    user.email,
    "Password Reset OTP",
    `Your OTP for resetting password is: ${otp}`
  );

  return { success: true, message: "OTP sent to email" };
};


export const reset_password = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) return { success: false, message: "User not found" };

  if (!user.resetOtp || !user.resetOtpExpires) {
    return { success: false, message: "No OTP found, request again" };
  }

  if (user.resetOtp !== otp) return { success: false, message: "Invalid OTP" };
  if (user.resetOtpExpires < Date.now()) return { success: false, message: "OTP expired" };

  user.password = newPassword;

  // Clear reset fields
  user.resetOtp = null;
  user.resetOtpExpires = null;
  await user.save();

  return { success: true, message: "Password reset successful" };
};


// $2b$10$KhijU5H7HY2SuTZX7y0FaO7VX8JE4IejIQ16ogsWwgwNVROGvHwFG