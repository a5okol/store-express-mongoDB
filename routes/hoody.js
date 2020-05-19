const { Router } = require("express");
const Product = require("../models/product-model");
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ typeOfclothes: "HOODY" })
      .populate("userId", "email name")
      .select("price title img typeOfclothes");

    res.render("hoody", {
      title: "Стильные свитера с капюшоном в интерент-магазина одежды",
      isHoody: true,
      userId: req.user ? req.user._id.toString() : null,
      products,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;