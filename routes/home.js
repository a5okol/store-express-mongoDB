const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    res.render('index', {
        title: 'Главная страница интерент-магазина одежды',
      })
})

module.exports = router
