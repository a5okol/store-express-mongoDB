const { Router } = require("express");
const Product = require("../models/product-model");
const auth = require("../middleware/auth");
const router = new Router();

router.get("/", auth, (req, res) => {
  res.render("addProduct", {
    title: "Добавить товар",
    isAddProduct: true,
  });
});

router.post("/", auth, async (req, res) => {
  // const product = new Product(
  //   req.body.typeOfclothes,
  //   req.body.availability,
  //   req.body.title,
  //   req.body.price,
  //   req.body.sku,
  //   req.body.quantity,
  //   req.body.img
  // );
  const product = new Product({
    typeOfclothes: req.body.typeOfclothes,
    availability: req.body.availability,
    title: req.body.title,
    price: req.body.price,
    sku: req.body.sku,
    quantity: req.body.quantity,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await product.save();
    res.redirect("/add-product");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
