import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import style from "./create-product.module.scss";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    thumbnail: "",
    productQuantity: 0,
  });
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/products`,
        productData,
        { withCredentials: true },
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Product added successfully");
        navigate("/admin-page");
      }
    } catch (error) {
      toast.error("Error on adding product");
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className={style.createProductForm}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            required
            type="text"
            name="title"
            value={productData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            required
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Thumbnail URL:</label>
          <input
            required
            type="text"
            name="thumbnail"
            value={productData.thumbnail}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Product Quantity:</label>
          <input
            required
            type="number"
            name="productQuantity"
            value={productData.productQuantity}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
