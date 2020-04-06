const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    res.render('addProduct', {
        title: 'Добавить товар',
        isAddProduct: true
      })
})

module.exports = router