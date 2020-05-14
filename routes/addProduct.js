const { Router } = require("express");
const { productValidators } = require("../utils/validators");
const { validationResult } = require("express-validator/check");

const Product = require("../models/product-model");
const auth = require("../middleware/auth");
const router = new Router();

router.get("/", auth, (req, res) => {
  res.render("addProduct", {
    title: "Добавить товар",
    isAddProduct: true,
  });
});

router.post("/", auth, productValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("addProduct", {
      title: "Добавить товар",
      isAddProduct: true,
      error: errors.array()[0].msg,
      data: {
        typeOfclothes: req.body.typeOfclothes,
        availability: req.body.availability,
        title: req.body.title,
        price: req.body.price,
        sku: req.body.sku,
        quantity: req.body.quantity,
        img: req.body.img,
        userId: req.user,
      },
    });
  }

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
