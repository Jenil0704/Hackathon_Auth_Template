import { registerUser, loginUser, reset_password, forgot_password } from "../services/authServices.js"
import { cookieOptions } from "../config/config.js";
import HttpError from "../utils/HttpError.js";
import User from "../models/User.js";
import {sendMail} from "../utils/mailer.js"; // your nodemailer setup

const register_user = async(req,res,next)=> {
    const {name, email, password} = req.body;
    try{
        const {token, user, otp} = await registerUser(name,email,password);
        req.user = user;
        
        console.log("Registration - Setting cookie with token:", token);
        console.log("Registration - Cookie options:", cookieOptions);
        
        // Send OTP email
        await sendMail(user.email, "Your OTP Code", `Your OTP is: ${otp}`);

        res.cookie("accessToken", token, cookieOptions);
        
        console.log("Registration - Cookie set successfully");
        res.status(200).json({message : "Registration Successful"});
    }
    catch(error){
        return next(HttpError.badRequest(error.message || "Registration failed"));
    }
}

const login_user = async(req,res,next)=> {
    const {email, password} = req.body;
    try{
        const {token, user} = await loginUser(email,password);
        req.user = user;
        
        console.log("Setting cookie with token:", token);
        console.log("Cookie options:", cookieOptions);
        
        res.cookie("accessToken", token, cookieOptions);
        
        console.log("Cookie set successfully");
        res.status(200).json({message : "Login Success"}); 
    }
    catch(error){
        return next(HttpError.unauthorized(error.message || "Invalid Credentials"));
    }
};

const logout_user = async(req,res)=> {
    res.clearCookie("accessToken", cookieOptions);
    res.status(200).json({message: "Logout Successful"});
};


const verify_otp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "No OTP found. Request again." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ OTP verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await forgot_password(email);
    res.json({ message : "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const response = await reset_password(email, otp, newPassword);
    res.json({ message : "Password set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
    register_user,
    login_user,
    logout_user,
    verify_otp,
    resetPassword,
    forgotPassword
}