const { Router } = require("express");
const { validationResult } = require("express-validator/check");

const Product = require("../models/product-model");
const auth = require("../middleware/auth");
const { productValidators } = require("../utils/validators.js");
const router = new Router();

function isOwner(product, req) {
  return product.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("userId", "email name")
      .select("price title img typeOfclothes");

    res.render("home", {
      title: "Главная страница интерент-магазина одежды",
      userId: req.user ? req.user._id.toString() : null,
      products,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!isOwner(product, req)) {
      return res.redirect("/");
    }

    res.render("product-edit", {
      title: `Редактировать ${product.title}`,
      product,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit", auth, productValidators, async (req, res) => {
  const errors = validationResult(req);
  const { id } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/${id}/edit?allow=true`);
  }

  try {
    delete req.body.id;
    const product = await Product.findById(id);
    if (!isOwner(product, req)) {
      return res.redirect("/");
    }
    Object.assign(product, req.body);
    await product.save();
    // await Product.findByIdAndUpdate(id, req.body);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Product.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("product", {
      layout: "empty",
      title: `Купить ${product.title} в интернет-магазине`,
      product,
    });
  } catch (err) {
    console.log(err);
  }
});



module.exports = router;
