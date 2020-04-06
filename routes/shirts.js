const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    res.render('shirts', {
        title: 'Стильные рубашки в интерент-магазина одежды',
        isShirts: true
      })
})

module.exports = router