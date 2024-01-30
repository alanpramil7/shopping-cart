import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./update.module.scss";

const Update = () => {
  const location = useLocation();
  const [updatedProduct, setUpdatedProduct] = useState({
    id: 0,
    title: "",
    price: 0,
    thumbnail: "",
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
        `http://localhost:5001/products/${updatedProduct.id}`,
        updatedProduct,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating product:", error);
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
          <button type="submit">Update Product</button>
        </form>
      )}
    </div>
  );
};

export default Update;
