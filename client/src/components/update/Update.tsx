import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./update.module.scss";
import toast from "react-hot-toast";

const Update = () => {
  const location = useLocation();
  const [updatedProduct, setUpdatedProduct] = useState({
    id: 0,
    title: "",
    price: 0,
    thumbnail: "",
    productQuantity: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state.product) {
      setUpdatedProduct(location.state.product);
    }
  }, [location.state.product]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct({
      ...updatedProduct,
      [name]: value,
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/products/${updatedProduct.id}`,
        updatedProduct,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        navigate("/admin-page");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error on updating");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={style.updateContainer}>
      <h1>Update Product</h1>
      {isUpdating ? (
        <p>Updating product...</p>
      ) : (
        <form onSubmit={handleUpdateProduct}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={updatedProduct.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Thumbnail:</label>
            <input
              type="text"
              name="thumbnail"
              value={updatedProduct.thumbnail}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Product Quantity:</label>
            <input
              type="number"
              name="productQuantity"
              value={updatedProduct.productQuantity}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Update Product</button>
        </form>
      )}
    </div>
  );
};

export default Update;
