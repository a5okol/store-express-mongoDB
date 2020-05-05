const { Router } = require("express");
const Order = require("../models/order-model");
const auth = require("../middleware/auth");
const router = new Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );
    res.render("orders", {
      isOrder: true,
      title: "Заказы",
      orders: orders.map((order) => {
        return {
          ...order._doc,
          price: order.products.reduce((total, c) => {
            return (total += c.count * c.product.price);
          }, 0),
        };
      }),
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.productId").execPopulate();

    const products = user.cart.items.map((i) => ({
      count: i.count,
      product: { ...i.productId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;