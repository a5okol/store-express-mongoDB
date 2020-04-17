const { Router } = require("express");
const Product = require("../models/product")
const router = new Router();

router.get("/", async (req, res) => {
  const products = await Product.getAll()
    res.render('backpacks', {
        title: 'Стильные рюкзаки в интерент-магазина одежды',
        isBackpacks: true,
        products
      })
})

module.exports = router