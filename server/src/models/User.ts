import { Model, DataType, DataTypes } from "sequelize";

import sequelize from "../sequalize";

export interface UserProps {
  id?: number;
  username: string;
  password: string;
  email: string;
  isAdmin?: boolean;
}

class User extends Model<UserProps> implements UserProps {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public isAdmin!: boolean;
}

User.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

export default User;
