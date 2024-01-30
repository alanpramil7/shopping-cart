interface CurrecyconverterProps {
  price: number;
}

const CurrecyFormatter = ({ price }: CurrecyconverterProps) => {
  const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return <span>{formattedCurrency.format(price)}</span>;
};

export default CurrecyFormatter;
