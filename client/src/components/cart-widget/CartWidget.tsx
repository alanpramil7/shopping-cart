import { useNavigate } from "react-router-dom";
import style from "./cart-widget.module.scss";

interface CartWidgetProps {
  productsCount: number;
}

const CartWidget = ({ productsCount }: CartWidgetProps) => {
  const navigate = useNavigate();

  return (
    <button className={style.container} onClick={() => navigate("/cart")}>
      <img src="/shopping-cart.svg" className={style.cart} alt="ShoppingCart" />
      {/* <span className={style.productcount}>{productsCount}</span> */}
    </button>
  );
};

export default CartWidget;
