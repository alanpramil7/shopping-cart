import { Sequelize } from "sequelize";

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: "localhost",
    logging: false,
  }
);

export default sequelize;
