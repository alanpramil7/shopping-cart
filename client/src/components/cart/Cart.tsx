import { CartProps, ProductType } from "../products/Product";
import Quantifier, { Operation } from "../quantifier/Quantifier";
import TotalPrice from "../total-price/TotalPrice";
import style from "./cart.module.scss";
import Header from "../header/Header";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../hooks/auth-context";
import axios from "axios";

const Cart = () => {
  const { authState } = useContext(AuthContext);
  const [cartProduct, setCartProduct] = useState<ProductType[]>([]);
  const [cartData, setCartData] = useState<CartProps>({});

  const productIds: number[] = Object.values(cartData).map(
    (item: any) => item.productId
  );

  const fetchCart = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/cart",
        {
          id: authState.user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.accesstoken}`,
          },
        }
      );

      if (response.data) {
        setCartData(response.data);
      }
    } catch (error) {}
  };

  const handleIds = async (ids: string[]) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/products/productbyids",
        { ids: Object.values(productIds) },
        {
          headers: {
            Authorization: `Bearer ${authState.accesstoken}`,
          },
        }
      );

      setCartProduct(response.data);
    } catch (error) {
      console.log("error in geting data by ids", error);
    }
  };

  useEffect(() => {
    if (authState.user) {
      fetchCart();
    }
  }, [authState.user]);

  useEffect(() => {
    if (Object.keys(cartData).length > 0) {
      const ids = Object.keys(cartData);

      handleIds(ids);
    }
  }, [cartData]);

  useEffect(() => {});

  // const cartItems = Object.values(cart || {});
  // const totalPrice = cartItems.reduce(
  //   (acc, product) => acc + product.price * product.quantity,
  //   0
  // );
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
          id: authState.user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.accesstoken}`,
          },
        }
      );
      if (response.status === 200) {
        window.location.reload();
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
                  handleRemoveProduct={() => {}}
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
