import style from "./quantifier.module.scss";
import { ProductType } from "../products/Product";
import toast from "react-hot-toast";

export type Operation = "increase" | "decrease";

interface QuantifierProps {
  handleQuantityUpdate: (productId: number, operation: Operation) => void;
  product: ProductType;
  quantity: number;
}

const Quantifier = ({
  handleQuantityUpdate,
  product,
  quantity,
}: QuantifierProps) => {

  const increase = () => {
    console.log(
      "Increase clicked",
      product.id,
      "Cart",
      quantity,
      "product",
      product.productQuantity
    );
    if (product.productQuantity !== 0) {
      handleQuantityUpdate(product.id, "increase");
    } else {
      toast.error("Out of stock");
    }
  };

  const reduce = () => {
    console.log("Decrease clicked", quantity, product.productQuantity);
    handleQuantityUpdate(product.id, "decrease");
  };

  return (
    <div className={style.quantifier}>
      <input
        type="button"
        value="-"
        onClick={reduce}
        className={style.buttonminus}
      />
      <input
        type="number"
        value={quantity}
        readOnly
        className={style.quantifierfield}
      />
      <input
        type="button"
        value="+"
        onClick={increase}
        className={style.buttonplus}
      />
    </div>
  );
};

export default Quantifier;
