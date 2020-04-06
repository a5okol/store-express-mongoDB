const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    res.render('hoody', {
        title: 'Стильные свитера с капюшоном в интерент-магазина одежды',
        isHoody: true
      })
})

module.exports = router