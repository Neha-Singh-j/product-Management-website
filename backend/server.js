const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/productsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(error => console.error("MongoDB connection error:", error));

// Define Product Schema
const productSchema = new mongoose.Schema({
    code: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const Product = mongoose.model("Product", productSchema);

// ✅ Get all products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

// ✅ Add a product
app.post("/api/addProduct", async (req, res) => {
    try {
        const { code, name, quantity, price } = req.body;

        if (!code || !name || !quantity || !price) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if product with the same code already exists
        const existingProduct = await Product.findOne({ code });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this code already exists!" });
        }

        const newProduct = new Product({ code, name, quantity, price });
        await newProduct.save();
        res.json({ message: "Product added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
});

// ✅ Delete a product
app.delete("/api/deleteProduct/:code", async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ code: req.params.code });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.json({ message: "Product deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
});

// ✅ Buy a product (Update quantity)
app.put("/api/buyProduct", async (req, res) => {
    try {
        const { code, buyQuantity } = req.body;

        if (!code || !buyQuantity) {
            return res.status(400).json({ message: "Product code and quantity are required!" });
        }

        const product = await Product.findOne({ code });

        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }

        if (product.quantity < buyQuantity) {
            return res.status(400).json({ message: "Not enough stock available!" });
        }

        product.quantity -= buyQuantity;
        await product.save();

        res.json({ message: "Purchase successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error processing purchase", error });
    }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
