const { Router } = require("express");

const Product = require("../models/product");
const router = new Router();

router.get("/", (req, res) => {
  res.render("addProduct", {
    title: "Добавить товар",
    isAddProduct: true,
  });
});

router.post("/", async (req, res) => {
  const product = new Product(
    req.body.typeOfclothing,
    req.body.availability,
    req.body.title,
    req.body.price,
    req.body.sku,
    req.body.quantity,
    req.body.img
  );


  await product.save()

  res.redirect('/add-product');
});

module.exports = router
