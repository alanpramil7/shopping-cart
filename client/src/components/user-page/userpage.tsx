import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/auth-context";
import CurrecyFormatter from "../currency-formatter/CurrencyFormater";
import Header from "../header/Header";
import Loader from "../loader/loader";
import { ProductType } from "../products/Product";
import style from "./userPage.module.scss";
import toast from "react-hot-toast";

const UserPage = () => {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
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

  const addToCart = async (product: ProductType) => {
    try {
      await axios.post(
        "http://localhost:5001/cart/add",
        {
          userId: user?.id,
          productId: product.id,
        },
        { withCredentials: true }
      );

      setProduct((pre) => {
        return pre.map((p) =>
          p.id === product.id
            ? {
                ...p,
                productQuantity: p.productQuantity - 1,
              }
            : p
        );
      });
      toast.success("Added to cart")
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error adding product to cart:", error);
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

        <div className={style.container}>
          {product.map((product) => {
            return (
              <div key={product.id} className={style.product}>
                <img src={product.thumbnail} alt="Thumbnail" />
                <h3>{product.title}</h3>
                <p>
                  <CurrecyFormatter price={product.price} />
                </p>
                {product.productQuantity === 0 ? (
                  <button disabled className={style.soldout}>
                    SoldOut
                  </button>
                ) : (
                  <button onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
export default UserPage;
