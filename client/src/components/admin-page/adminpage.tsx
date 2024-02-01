import axios from "axios";
import { useState, useEffect, useContext } from "react";
import style from "./adminPage.module.scss";
import Loader from "../loader/loader";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/auth-context";
import CurrecyFormatter from "../currency-formatter/CurrencyFormater";
import { ProductType } from "../products/Product";
import toast from "react-hot-toast";

const AdminPage = () => {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/products");
        if (response.data) {
          const data = response.data;
          setProduct(data);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/products/${productId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProduct(product.filter((item) => item.id !== productId));
        toast.success("Deleted")
        console.log("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error on deleting")
    }
  };

  if (error) {
    return (
      <h3 className={style.error}>
        Ann error has occured when searching the data. Please check the api.
      </h3>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <section className={style.productpage}>
        <h1 data-testid="title">Product</h1>
        {user?.isAdmin && (
          <button
            className={style.addProductButton}
            onClick={() => navigate("/product/new")}
          >
            Add New Product
          </button>
        )}
        <div className={style.container}>
          {product.map((product) => {
            return (
              <div key={product.id} className={style.product}>
                <img src={product.thumbnail} alt="Thumbnail" />
                <h3>{product.title}</h3>
                <p>
                  <CurrecyFormatter price={product.price} />
                </p>

                <p>Quantity: {product.productQuantity}</p>
                <div className={style.updatediv}>
                  <button
                    className={style.updatebtn}
                    onClick={() => navigate("/update", { state: { product } })}
                  >
                    Update
                  </button>
                  <button
                    className={style.updatebtn}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default AdminPage;
