import express from "express";
import { cookieToken } from "../middlewere/middlewere";
import Cart, { CartProps } from "../models/Cart";

interface CartDataProps {
  [key: number]: CartProps;
}

const router = express.Router();

router.use(cookieToken);

router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;
  const [existingCart, created] = await Cart.findOrCreate({
    where: { userId, productId },
    defaults: { quantity: 1 },
  });
  if (!created) {
    existingCart.quantity += 1;
    await existingCart.save();
  }
  res
    .status(200)
    .json({ message: "Product added to the cart", cart: existingCart });
  try {
  } catch (error) {
    res.status(500).json({ message: "Error adding products to cart" });
  }
});

router.post("/", async (req, res) => {
  const userId = req.body.id;
  try {
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
    });
    res.status(200).send(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error geting cartdata" });
  }
});

router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const operation = req.body.operation;
  const id = req.body.id;

  try {
    const cart = await Cart.findOne({
      where: {
        userId: id,
        productId: productId,
      },
    });
    const quantity = cart.quantity;

    if (quantity === 1 && operation === "decrease") {
      const response = await Cart.destroy({
        where: {
          userId: id,
          productId,
        },
      });
    } else if (operation === "increase") {
      const response = await Cart.update(
        {
          quantity: quantity + 1,
        },
        {
          where: {
            userId: id,
            productId,
          },
        }
      );
    } else if (operation === "decrease") {
      const response = await Cart.update(
        {
          quantity: quantity - 1,
        },
        {
          where: {
            userId: id,
            productId,
          },
        }
      );
    }

    res.status(200).json({ message: "quantity updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity" });
  }
});

export default router;
