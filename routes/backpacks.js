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

router.get('/:id', async (req, res) => {
  const product = await Product.getById(req.params.id)
  res.render('product', {
    layout: 'empty',
    title: `Купить ${product.title} в интернет-магазине`,
    product
  })
})

module.exports = router