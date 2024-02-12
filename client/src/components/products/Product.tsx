import { useState, useEffect, useContext } from "react";
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
  productQuantity: number;
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products`,
        );
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

  console.log(product);

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
        <h1>Product</h1>
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
              <div
                data-testid="product"
                key={product.id}
                className={style.product}
              >
                <img src={product.thumbnail} alt="Thumbnail" />
                <h3>{product.title}</h3>
                <p>
                  <CurrecyFormatter price={product.price} />
                </p>
                <button onClick={() => navigate("/login")}>Add to cart</button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Product;
