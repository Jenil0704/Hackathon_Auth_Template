import Product from "../models/Product.js";

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

export const findProductsByUser = async (userId) => {
  return Product.find({ user_id: userId, is_active: true }).sort({ createdAt: -1 });
};

export const findAllActiveProducts = async () => {
  return Product.find({ is_active: true }).sort({ createdAt: -1 });
};

export const findProductById = async (productId) => {
  return Product.findById(productId);
};

export const updateProductById = async (productId, updateData) => {
  return Product.findByIdAndUpdate(productId, updateData, { new: true });
};

export const deleteProductById = async (productId) => {
  return Product.findByIdAndDelete(productId);
};


