import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for reset password / login
  email: { type: String, required: true }, // for registration & also helps in reset
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true },
  type: { type: String, enum: ["register", "reset"], required: true }, // OTP purpose
  name: { type: String }, // only needed for registration
  password: { type: String }, // only needed for registration (hashed)
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5min
});

export default mongoose.model("Otp", otpSchema);
