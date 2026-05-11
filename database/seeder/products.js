import mongoose from "mongoose";
import Product from '../models/product.js';

mongoose
  .connect("mongodb://127.0.0.1:27017/shop_db")
  .then((result) => {
    console.log("Connected to MongoDb");
    seedDB()
  })
  .catch((err) => {
    console.log("MongoDB connection Error:", err);
  });

//   Generate Data Model
const seedProducts = [
    {
      "name": "Kemeja Flanel",
      "brand": "Hollister",
      "price": 750000,
      "color": "biru muda",
      "category": "Baju",
    },
    {
      "name": "Celana Chino",
      "brand": "Levi's",
      "price": 900000,
      "color": "krem",
      "category": "Celana",
    },
    {
      "name": "Sweater",
      "brand": "Gap",
      "price": 650000,
      "color": "merah muda",
      "category": "Baju",
    },
    {
      "name": "Sepatu Sneakers",
      "brand": "Nike",
      "price": 1200000,
      "color": "putih",
      "category": "Sepatu",
    },
    {
      "name": "Baju Renang",
      "brand": "Speedo",
      "price": 500000,
      "color": "biru tua",
      "category": "Baju",
    },
    {
      "name": "Rompi",
      "brand": "Zara",
      "price": 850000,
      "color": "abu-abu",
      "category": "Aksesoris",
    },
    {
      "name": "Jas",
      "brand": "Hugo Boss",
      "price": 4500000,
      "color": "hitam",
      "category": "Jaket",
    },
];

// Seed Database Function
const seedDB = async () => {
    try{
        await Product.deleteMany({})

        const result = await Product.insertMany(seedProducts)
        console.log("📦 Seed Data Success:", result);
    }catch(err){
        console.error("🔥 Seeding Error:", err);
    }
}
