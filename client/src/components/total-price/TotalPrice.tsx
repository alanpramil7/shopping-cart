import CurrecyFormatter from "../currency-formatter/CurrencyFormater";
import style from "./totalprice.module.scss";

interface TotalPriceProps {
  amount: number;
}

const TotalPrice = ({ amount }: TotalPriceProps) => {
  return (
    <div className={style.totalprice}>
      Total : {<CurrecyFormatter price={amount} />}
    </div>
  );
};

export default TotalPrice;
