import { findUserByEmail, findUserByEmailAndPassword, createUser } from "../microservices/user.dao.js";
import User from "../models/User.js";
import { signToken } from "../utils/helper.js";
import crypto from 'crypto'
import bcrypt from 'bcrypt';
import Otp from "../models/Otp.js";
import { sendMail } from "../utils/mailer.js";


export const registerUser = async(name,email,password) => {
    const user = await findUserByEmail(email);
    if(user) throw Error('User already exists');
    
    // generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    // upsert OTP record (if user requests again, overwrite old OTP)
    await Otp.findOneAndUpdate(
      { email },
      { name, email, password, otp, otpExpires },
      { upsert: true, new: true }
    );
    return {otp, email};
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
  const otpExpires = Date.now() + 5 * 60 * 1000;

  await Otp.findOneAndUpdate(
    { email: user.email, type: "reset" },
    { userId: user._id, email: user.email, otp, otpExpires, type: "reset" },
    { upsert: true, new: true }
  );

  await sendMail(
    user.email,
    "Password Reset OTP",
    `Your OTP for resetting password is: ${otp}`
  );

  return { success: true, message: "OTP sent to email" };
};


export const reset_password = async (email, otp, newPassword) => {
  const otpRecord = await Otp.findOne({ email, type: "reset" });
  if (!otpRecord) return { success: false, message: "No OTP found, request again" };

  if (otpRecord.otp !== otp) return { success: false, message: "Invalid OTP" };
  if (otpRecord.otpExpires < Date.now())
    return { success: false, message: "OTP expired" };

  // Find user
  const user = await User.findOne({ email });
  if (!user) return { success: false, message: "User not found" };

  user.password = newPassword;
  await user.save();

  // Delete OTP record after success
  await Otp.deleteOne({ email, type: "reset" });

  return { success: true, message: "Password reset successful" };
};



export const verify_Otp = async (email, otp) => {
  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord){
    throw Error("OTP not found or expired")
  };

  if(otpRecord.otp !== otp){
    throw Error("Invalid OTP")
  };

  if(otpRecord.otpExpires < Date.now()){
    throw Error("OTP expired")
  };

  const name = otpRecord.name;
  const newUserEmail = otpRecord.email;
  const password = otpRecord.password;

  const newUser = await createUser(name,newUserEmail,password);
  const token = signToken({id : newUser._id});
  // issue token
  console.log('Token set successfully',token);
  
  // delete OTP record
  await Otp.deleteOne({ email });
  return { token, user: newUser };
};