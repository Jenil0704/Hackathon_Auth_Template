import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    otp: { type: String }, // store OTP temporarily
    otpExpires: { type: Date }, // OTP expiry
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }, // mark after OTP verification
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    product_id : {type : mongoose.Schema.Types.ObjectId, ref : 'Product'}
})

userSchema.pre('save', async function(next) {
    // Update the updatedAt field
    this.updatedAt = new Date();
    
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password along with the new salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Use bcrypt to compare the provided password with the hashed password
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

export default mongoose.model("User", userSchema);