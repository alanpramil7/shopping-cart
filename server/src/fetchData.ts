import axios from "axios";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

const fetchData = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("https://dummyjson.com/products");
    const products: Product[] = response.data.products.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    }));

    return products;
  } catch (error) {
    console.log("Something went wrong in datafetch :", error);
    return [];
  }
};

export default fetchData;
