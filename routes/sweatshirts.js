const { Router } = require("express");
const Product = require("../models/product-model");
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ typeOfclothes: "SWEATSHIRTS" })
      .populate("userId", "email name")
      .select("price title img typeOfclothes");

    res.render("sweatshirts", {
      title: "Стильные толстовки в интерент-магазина одежды",
      isSweatshirts: true,
      userId: req.user ? req.user._id.toString() : null,
      products,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;