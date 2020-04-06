const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
  res.render("addProduct", {
    title: "Добавить товар",
    isAddProduct: true,
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.redirect('/add-product')
});

module.exports = router;
