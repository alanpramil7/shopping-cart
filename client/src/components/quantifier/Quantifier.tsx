import { useState } from "react";
import style from "./quantifier.module.scss";

export type Operation = "increase" | "decrease";

interface QuantifierProps {
  handleQuantityUpdate: (productId: number, operation: Operation) => void;
  productId: number;
  quantity: number;
  handleRemoveProduct: (productId: number) => void;
}

const Quantifier = ({
  handleQuantityUpdate,
  productId,
  quantity,
  handleRemoveProduct,
}: QuantifierProps) => {
  const [value, setValue] = useState<number>(quantity);

  const increase = () => {
    handleQuantityUpdate(productId, "increase");
    setValue((prev) => prev + 1);
  };

  const reduce = () => {
    handleQuantityUpdate(productId, "decrease");

    setValue((prev) => {
      const newValue = prev - 1;
      if (newValue === 0) {
        handleRemoveProduct(productId);
      }
      return newValue;
    });
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
        step="1"
        max=""
        value={value}
        className={style.quantifierfield}
        onChange={(event) => setValue(parseInt(event.target.value))}
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
