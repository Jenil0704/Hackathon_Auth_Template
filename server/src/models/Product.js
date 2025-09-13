import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  category: { type: String },
  condition: { type: String, enum: ["new", "used", "refurbished"], default: "new" },
  image_url: { type: String },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });


export default mongoose.model("Product", productSchema);
