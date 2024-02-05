import express from "express";
import Product from "../models/Product";
import { cookieToken, isAdmin } from "../middlewere/middlewere";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["id", "ASC"]],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error in fetching products ", error });
  }
});

router.use(cookieToken);

router.post("/", isAdmin, async (req, res) => {
  try {
    const newProduct = await Product.create({
      title: req.body.title,
      price: req.body.price,
      thumbnail: req.body.thumbnail,
      productQuantity: req.body.productQuantity,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id } });
  if (!product) {
    res.status(500).json({ message: "No product in that id" });
  }

  res.status(200).json(product);
});

router.post("/productbyids", async (req, res) => {
  const ids = req.body.ids;

  try {
    const productByIds = await Product.findAll({
      where: {
        id: ids,
      },
      order: [["id", "ASC"]],
    });

    res.status(200).json(productByIds);
  } catch (error) {
    res.status(500).json({ message: "Error finding product by ids" });
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, price, thumbnail, productQuantity } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await product.update({
      title: title || product.title,
      price: price || product.price,
      thumbnail: thumbnail || product.thumbnail,
      productQuantity: productQuantity || product.productQuantity,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default router;
