import { useState, useEffect, useContext, useCallback } from "react";
import CurrecyFormatter from "../currency-formatter/CurrencyFormater";
import Loader from "../loader/loader";
import style from "./product.module.scss";
import axios from "axios";
import Header from "../header/Header";
import { AuthContext } from "../../hooks/auth-context";
import { useNavigate } from "react-router-dom";

export type ProductType = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  image: string;
  quantity: number;
};

export interface CartProps {
  [key: string]: {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
  };
}

const Product = () => {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(AuthContext);
  const [cartData, setCartData] = useState<CartProps>();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/cart",
        {
          id: user?.id,
        },
        { withCredentials: true }
      );

      if (response.data) {
        setCartData(response.data);
      }
    } catch (error) {}
  }, [user?.id]);

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

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (error) {
    return (
      <h3 className={style.error}>
        Ann error has occured when searching the data. Please check the api.
      </h3>
    );
  }

  const addToCart = async (product: ProductType) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/cart/add",
        {
          userId: user?.id,
          productId: product.id,
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        fetchCart();
      } else {
        console.error("Error adding product to cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const isInCart = (productId: number): boolean => {
    return (
      !!cartData &&
      Object.values(cartData).some((item: any) => item.productId === productId)
    );
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/products/${productId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProduct(product.filter((item) => item.id !== productId));
        console.log("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
                <button
                  disabled={isInCart(product.id)}
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
                {user?.isAdmin ? (
                  <div className={style.updatediv}>
                    <button
                      className={style.updatebtn}
                      onClick={() =>
                        navigate("/update", { state: { product } })
                      }
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
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Product;
