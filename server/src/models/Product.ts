import { Model, DataTypes } from "sequelize";
import sequelize from "../sequalize";
import fetchData from "../fetchData";

interface ProductAttributes {
  id?: number;
  title: string;
  price: number;
  thumbnail: Text;
  productQuantity: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public title!: string;
  public price!: number;
  public thumbnail!: Text;
  public productQuantity!: number;
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
    thumbnail: DataTypes.TEXT,
    productQuantity: DataTypes.INTEGER,
  },
  { sequelize, modelName: "product" },
);

export default Product;
