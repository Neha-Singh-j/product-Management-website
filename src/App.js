import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// const API_URL = "http://localhost:5000"; // Backend URL
const API_URL = "http://localhost:5000/api";
function App() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ code: "", name: "", quantity: "", price: "" });
    const [deleteCode, setDeleteCode] = useState("");
    const [buyData, setBuyData] = useState({ code: "", quantity: "" });

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addProduct = async () => {
        const { code, name, quantity, price } = formData;
        if (!code || !name || !quantity || !price) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/addProduct`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: parseInt(code),
                    name,
                    quantity: parseInt(quantity),
                    price: parseFloat(price),
                }),
            });

            if (!response.ok) throw new Error("Failed to add product");

            alert("Product added successfully!");
            fetchProducts();
            setFormData({ code: "", name: "", quantity: "", price: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const deleteProduct = async () => {
        if (!deleteCode) {
            alert("Enter product code to delete.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/deleteProduct/${parseInt(deleteCode)}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete product");

            alert("Product deleted successfully!");
            fetchProducts();
            setDeleteCode("");
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleBuyChange = (e) => {
        setBuyData({ ...buyData, [e.target.name]: e.target.value });
    };

    const buyProduct = async () => {
        const { code, quantity } = buyData;

        if (!code || !quantity) {
            alert("Enter product code and quantity.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/buyProduct`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: parseInt(code),
                    buyQuantity: parseInt(quantity),
                }),
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) fetchProducts();

        } catch (error) {
            console.error("Error buying product:", error);
        }

        setBuyData({ code: "", quantity: "" });
    };

    return (
        <div className="container mt-4">
            

            {/* Add Product Section */}
            <h2>Add Product</h2>
            <div className="input-group mb-3">
                {["code", "name", "quantity", "price"].map((field) => (
                    <input
                        key={field}
                        type={field === "name" ? "text" : "number"}
                        className="form-control"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                    />
                ))}
                <button className="btn btn-primary" onClick={addProduct}>Add Product</button>
            </div>

            {/* Delete Product Section */}
            <h2>Delete Product</h2>
            <div className="input-group mb-3">
                <input type="number" className="form-control" placeholder="Product Code"
                    value={deleteCode} onChange={(e) => setDeleteCode(e.target.value)} />
                <button className="btn btn-danger" onClick={deleteProduct}>Delete Product</button>
            </div>

            {/* Buy Product Section */}
            <h2>Buy Product</h2>
            <div className="input-group mb-3">
                {["code", "quantity"].map((field) => (
                    <input
                        key={field}
                        type="number"
                        className="form-control"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        value={buyData[field]}
                        onChange={handleBuyChange}
                    />
                ))}
                <button className="btn btn-success" onClick={buyProduct}>Buy</button>
            </div>

            {/* Product List Section */}
            <h2>Product List</h2>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.code}>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>${product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
