const { Router } = require("express");
const Product = require("../models/product-model");
const router = new Router();

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.productId._doc, count: c.count
  }))
}

function computePrice(products) {
  return products.reduce((total, product) => {
    return total += product.price * product.count
  }, 0)
}

router.post("/add", async (req, res) => {
  const product = await Product.findById(req.body.id);
  await req.user.addToCart(product);
  res.redirect("/card");
});

router.delete("/remove/:id", async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});

router.get("/", async (req, res) => {
  const user = await req.user
  // console.log(user.cart.items)
  .populate('cart.items.productId')
  .execPopulate()

  console.log(user.cart.items)
  const products = mapCartItems(user.cart)

  res.render("card", {
    title: "Корзина",
    isCard: true,
    products: products,
    price: computePrice(products)
  });
});

module.exports = router;
