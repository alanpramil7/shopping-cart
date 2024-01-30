import { useNavigate } from "react-router-dom";
import style from "./cart-widget.module.scss";

const CartWidget = () => {
  const navigate = useNavigate();

  return (
    <button className={style.container} onClick={() => navigate("/cart")}>
      <img src="/shopping-cart.svg" className={style.cart} alt="ShoppingCart" />
    </button>
  );
};

export default CartWidget;
