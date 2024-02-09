import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { CartProps, ProductType } from "../products/Product";
import Quantifier, { Operation } from "../quantifier/Quantifier";
import TotalPrice from "../total-price/TotalPrice";
import style from "./cart.module.scss";
import Header from "../header/Header";
import { AuthContext } from "../../hooks/auth-context";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cartProduct, setCartProduct] = useState<ProductType[]>([]);
  const [cartData, setCartData] = useState<CartProps>({});

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      if (!user) return;

      try {
        const cartResponse = await axios.get("http://localhost:5001/cart", {
          withCredentials: true,
        });
        const cart = cartResponse.data;
        setCartData(cart);

        const productIds = Object.values(cart).map(
          (item: any) => item.productId,
        );
        if (productIds.length > 0) {
          const productsResponse = await axios.post(
            "http://localhost:5001/products/productbyids",
            { ids: productIds },
            { withCredentials: true },
          );
          setCartProduct(productsResponse.data);
        }
      } catch (error) {
        console.error("No products to show:", error);
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
    operation: Operation,
  ) => {
    console.log("Handle function", productId, operation);
    try {
      const response = await axios.put(
        `http://localhost:5001/cart/${productId}`,
        {
          operation,
          id: user?.id,
        },
        { withCredentials: true },
      );
      if (response.status === 200) {
        const newCartData = { ...cartData };
        const cartItem = Object.values(newCartData).find(
          (item) => item.productId === productId,
        );
        if (cartItem) {
          if (operation === "increase") {
            cartItem.quantity += 1;
          } else if (operation === "decrease" && cartItem.quantity > 0) {
            cartItem.quantity -= 1;
          }
        }
        setCartData(newCartData);

        // setCartProduct((prevProducts) =>
        //   prevProducts.map((product) =>
        //     product.id === productId
        //       ? { ...product, productQuantity: product.productQuantity - 1 }
        //       : product,
        //   ),
        // );
      }
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log("error updating quantity :", error);
    }
  };

  return (
    <>
      <Header />
      <section className={style.cart}>
        <h1>Cart</h1>
        <div className={style.container}>
          {cartProduct
            .filter((item) => {
              const cartItem = Object.values(cartData).find(
                (cart) => cart.productId === item.id,
              );
              return cartItem && cartItem.quantity > 0;
            })
            .map((item) => {
              const cartItem = Object.values(cartData).find(
                (cart) => cart.productId === item.id,
              );
              return (
                <div key={item.id} className={style.product}>
                  <img src={item.thumbnail} alt="Thumbnail" />
                  <h3>{item.title}</h3>
                  <Quantifier
                    handleQuantityUpdate={handleQuantityUpdate}
                    product={item}
                    quantity={cartItem ? cartItem.quantity : 0}
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
