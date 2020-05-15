const { Router } = require("express");
const Product = require("../models/product-model");
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ typeOfclothes: "T-SHIRTS" })
      .populate("userId", "email name")
      .select("price title img typeOfclothes");

    res.render("t-shirts", {
      title: "Стильные футболки в интерент-магазина одежды",
      isTShirts: true,
      userId: req.user ? req.user._id.toString() : null,
      products,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;