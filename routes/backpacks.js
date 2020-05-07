const { Router } = require("express");
const Product = require("../models/product-model");
const auth = require("../middleware/auth");
const router = new Router();

router.get("/", async (req, res) => {
  const products = await Product.find({ typeOfclothes: "BACKPACKS" })
    .populate("userId", "email name")
    .select("price title img typeOfclothes");

  res.render("backpacks", {
    title: "Стильные рюкзаки в интерент-магазина одежды",
    isBackpacks: true,
    products,
  });
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const product = await Product.findById(req.params.id);

  res.render("product-edit", {
    title: `Редактировать ${product.title}`,
    product,
  });
});

router.post("/edit", auth, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Product.findByIdAndUpdate(id, req.body);
  res.redirect("/");
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.body.id });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("product", {
    layout: "empty",
    title: `Купить ${product.title} в интернет-магазине`,
    product,
  });
});

module.exports = router;
