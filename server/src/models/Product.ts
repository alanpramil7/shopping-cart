import { Model, DataTypes } from "sequelize";
import sequelize from "../sequalize";
import fetchData from "../fetchData";

interface ProductAttributes {
  id?: number;
  title: string;
  price: number;
  thumbnail: string;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public title!: string;
  public price!: number;
  public thumbnail!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    thumbnail: DataTypes.STRING,
  },
  { sequelize, modelName: "product" }
);

// Product.sync({ force: true })
//   .then(async () => {
//     try {
//       const products = await fetchData();
//       for (const productsData of products) {
//         await Product.create(productsData);
//       }
//     } catch (error) {
//       console.log("Error while poulating the data");
//     }
//   })
//   .catch((error) => {
//     console.log("Error while syncing the data");
//   });

export default Product;
