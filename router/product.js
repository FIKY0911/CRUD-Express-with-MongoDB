import express from "express";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
import Product from "../models/product.js";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Untuk panggil file ejs, kita set dulu folder views dan view engine nya
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

  // Untuk panggil file ejs, kita set dulu folder views dan view engine nya
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// methodOverride config untuk menerima _method dari body, query, dan header
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(methodOverride('_method'));

//  GET
app.get("/", (req, res) => {
  res.send("Welcome to Shop App");
});

// MENAMPILKAN DATA AWAL
app.get("/products", async (req, res) => {
  const {category} = req.query;
  if(category){
    const products = await Product.find({category});
    res.render("products/index", { products, category });
  }else{
  const products = await Product.find({});
  res.render("products/index", { products, category: 'All' });
  }
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

// DELETE
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Product not found");
    }
    res.redirect('/products');
  } catch (err) {
    console.log("Delete Error:", err);
    res.status(400).send("Error deleting product: Invalid ID Format");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
