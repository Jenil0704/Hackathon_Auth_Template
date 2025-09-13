import { findUserById } from "../microservices/user.dao.js";
import User from "../models/User.js";

const getProfile = async (req, res) => {
    try {
        // req.user is already set by the auth middleware
        // Remove sensitive information like password
        const { password, ...userWithoutPassword } = req.user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({ message: "Failed to get profile" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, bio, avatar } = req.body;
        
        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, bio, avatar },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

export default {
    getProfile,
    updateProfile
};
