const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'index.html'))
    res.render('t-shirts', {
        title: 'Стильные футболки в интерент-магазина одежды',
        isTShirts: true
      })
})

module.exports = router