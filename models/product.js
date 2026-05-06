import mongoose, { model } from "mongoose";

// Model dasar
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Baju", "Celana", "Sepatu", "Aksesoris", "Jaket"],
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product
