import express from "express";
import { cookieToken, customRequest, isAdmin, isUser } from "../middlewere/middlewere";
import Cart, { CartProps } from "../models/Cart";
import sequelize from "../sequalize";
import Product from "../models/Product";

const router = express.Router();

router.use(cookieToken);

router.get("/",  async (req: customRequest, res) => {
  const userId = req.user.id;
  try {
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      order: [["id", "ASC"]],
    });
    res.status(200).send(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error geting cartdata" });
  }
});

router.post("/add",isUser, async (req, res) => {
  const { userId, productId } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const [existingCart, created] = await Cart.findOrCreate({
      where: { userId, productId },
      defaults: { quantity: 1 },
      transaction,
    });
    if (!created) {
      existingCart.quantity += 1;
      await existingCart.save({ transaction });
    }
    const product = await Product.findOne({
      where: { id: productId },
      transaction,
    });

    if (!product || product.productQuantity <= 0) {
      transaction.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Product is out of stock" });
    }

    product.productQuantity -= 1;
    await product.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Product added to the cart",
      cart: existingCart,
    });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ success: false, message: "Error adding products to cart" });
  }
});

router.put("/:productId",  async (req, res) => {
  const { productId } = req.params;
  const operation = req.body.operation;
  const userId = req.body.id;

  const transaction = await sequelize.transaction();

  try {
    const cartItem = await Cart.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
      transaction,
    });

    if (!cartItem) {
      await transaction.rollback();
      return res.status(404).json({ message: "Cart item not found" });
    }

    const product = await Product.findOne({
      where: { id: productId },
      transaction,
    });


    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ message: "Product not found" });
    }

    if (operation === "increase") {
      if (product.productQuantity > 0) {
        cartItem.quantity += 1;
        product.productQuantity -= 1;
      } else {
        await transaction.rollback();
        return res.status(400).json({ message: "Product is out of stock" });
      }
    } else if (operation === "decrease") {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        product.productQuantity += 1;
      } else {
        await cartItem.destroy({ transaction });
        product.productQuantity += 1;
      }
    }

    await cartItem.save({ transaction });
    await product.save({ transaction });

    await transaction.commit();
    res.status(200).json({ message: "Quantity updated" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});

export default router;
