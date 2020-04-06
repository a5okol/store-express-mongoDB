const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    res.render('backpacks', {
        title: 'Стильные рюкзаки в интерент-магазина одежды',
        isBackpacks: true
      })
})

module.exports = router