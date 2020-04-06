const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    res.render('sweatshirts', {
        title: 'Стильные толстовки в интерент-магазина одежды',
        isSweatshirts: true
      })
})

module.exports = router