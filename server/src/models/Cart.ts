import { Model, DataTypes } from "sequelize";
import sequelize from "../sequalize";

export interface CartProps {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
}

class Cart extends Model<CartProps> implements CartProps {
  public id!: number;
  public userId: number;
  public productId!: number;
  public quantity!: number;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "cart",
    tableName: "carts",
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  },
);

export default Cart;
