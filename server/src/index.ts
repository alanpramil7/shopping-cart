import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Product from "./models/Product";
import productRoute from "./routes/productRoute";
import userRoute from "./routes/userRoute";
import cartRoute from "./routes/cartRoute";
import sequelize from "./sequalize";
import Cart from "./models/Cart";
import "./models/db";
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Hello Alan" });
});

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/cart", cartRoute);

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Data and Models are synced");
    app.listen(5001, () => {
      console.log("server is running on port 5001...");
    });
  } catch (error) {
    console.log("error while syncing the models, ", error);
  }

  // await Cart.sync({ alter: true }).then(() => {
  //   console.log("Cart synced");
  // });

  // await sequelize
  //   .sync()
  //   .then(() => {
  //     app.listen(5001, () => {
  //       console.log("Server is running in port 5001");
  //     });
  //   })
  //   .catch((error) => {
  //     console.log("Error while syncing database");
  //   });
};

startServer();
