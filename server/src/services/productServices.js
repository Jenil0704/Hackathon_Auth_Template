import {
  createProduct,
  findProductsByUser,
  findProductById,
  updateProductById,
  deleteProductById,
  findAllActiveProducts,
} from "../microservices/product.dao.js";

export const addProduct = async (userId, payload) => {
  return createProduct({ ...payload, user_id: userId });
};

export const listMyProducts = async (userId) => {
  return findProductsByUser(userId);
};

export const listPublicProducts = async () => {
  return findAllActiveProducts();
};

export const getMyProduct = async (userId, productId) => {
  const product = await findProductById(productId);
  if (!product || String(product.user_id) !== String(userId)) {
    throw new Error("Product not found");
  }
  return product;
};

export const updateMyProduct = async (userId, productId, payload) => {
  const product = await findProductById(productId);
  if (!product || String(product.user_id) !== String(userId)) {
    throw new Error("Product not found or unauthorized");
  }
  return updateProductById(productId, payload);
};

export const removeMyProduct = async (userId, productId) => {
  const product = await findProductById(productId);
  if (!product || String(product.user_id) !== String(userId)) {
    throw new Error("Product not found or unauthorized");
  }
  await deleteProductById(productId);
  return { success: true };
};


