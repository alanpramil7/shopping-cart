import { CartProps, ProductType } from "../products/Product";
import Quantifier, { Operation } from "../quantifier/Quantifier";
import TotalPrice from "../total-price/TotalPrice";
import style from "./cart.module.scss";
import Header from "../header/Header";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../hooks/auth-context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cartProduct, setCartProduct] = useState<ProductType[]>([]);
  const [cartData, setCartData] = useState<CartProps>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      if (!user) return;

      try {
        const cartResponse = await axios.post(
          "http://localhost:5001/cart",
          { id: user.id },
          { withCredentials: true }
        );
        const cart = cartResponse.data;
        setCartData(cart);

        const productIds = Object.values(cart).map(
          (item: any) => item.productId
        );
        if (productIds.length > 0) {
          const productsResponse = await axios.post(
            "http://localhost:5001/products/productbyids",
            { ids: productIds },
            { withCredentials: true }
          );
          setCartProduct(productsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching cart or products:", error);
      }
    };

    fetchCartAndProducts();
  }, [user]);

  const totalPrice = cartProduct.reduce((total, product) => {
    const quantity =
      Object.values(cartData).find((cart) => cart.productId === product.id)
        ?.quantity || 0;
    return total + product.price * quantity;
  }, 0);

  const handleQuantityUpdate = async (
    productId: number,
    operation: Operation
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/cart/${productId}`,
        {
          operation,
          id: user?.id,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate(0);
      }
      console.log(response.data);
    } catch (error) {
      console.log("error updating quantity :", error);
    }
  };

  return (
    <>
      <Header />
      <section className={style.cart}>
        <h1>Cart</h1>
        <div className={style.container}>
          {cartProduct.map((item) => {
            const quantity = Object.values(cartData).filter(
              (cart: any) => cart.productId === item.id
            );
            return (
              <div key={item.id} className={style.product}>
                <img src={item.thumbnail} alt="Thumbnail" />
                <h3>{item.title}</h3>
                <Quantifier
                  handleQuantityUpdate={handleQuantityUpdate}
                  productId={item.id}
                  quantity={quantity[0].quantity}
                />
              </div>
            );
          })}
        </div>
        <TotalPrice amount={totalPrice} />
      </section>
    </>
  );
};
export default Cart;
