import express from "express";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
import Product from "./models/product.js";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Mongo DB
mongoose
  .connect("mongodb://127.0.0.1:27017/shop_db")
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//  GET
app.get("/", (req, res) => {
  res.send("Welcome to Shop App");
});

// MENAMPILKAN DATA AWAL
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

// MENAMPILKAN MENU CREATE
app.get("/products/create", (req, res) => {
  res.render("products/create");
});

// MENAMPILKAN DETAIL BARANG
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("products/show", { product });
  } catch (err) {
    res.status(400).send("Invalid ID Format");
  }
});

// MENAMPILKAN MENU EDIT
app.get("/products/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("products/edit", { product });
  } catch (err) {
    res.status(400).send("Invalid ID Format");
  }
});

// POST
// MEMBUAT BARANG KEMUDIAN REDIRECT KE ID
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    // Redirect ke halaman detail barang yang baru dibuat
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    console.log(err);
    res.send("Error saving product");
  }
});

// PUT
//UNTUK EDIT BARANG
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.redirect(`/products/${product._id}`)
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
