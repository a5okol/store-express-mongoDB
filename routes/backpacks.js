const { Router } = require("express");
const Product = require("../models/product-model");
const router = new Router();

router.get("/", async (req, res) => {
  // consile.log(req.params.typeOfclothe)
  const products = await Product.getBackpacks();
  res.render("backpacks", {
    title: "Стильные рюкзаки в интерент-магазина одежды",
    isBackpacks: true,
    products,
  });
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const product = await Product.getById(req.params.id);

  res.render("product-edit", {
    title: `Редактировать ${product.title}`,
    product,
  });
});

router.post("/edit", async (req, res) => {
  await Product.update(req.body);
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render("product", {
    layout: "empty",
    title: `Купить ${product.title} в интернет-магазине`,
    product,
  });
});

module.exports = router;