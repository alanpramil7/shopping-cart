import { Sequelize } from "sequelize";

const sequelize = new Sequelize("test", "postgres", "qwert@123", {
  dialect: "postgres",
  host: "localhost",
  logging: false,
});

export default sequelize;
