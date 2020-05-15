const { Router } = require("express");
const auth =require("../middleware/auth")
const router = new Router();

router.get("/", async (req, res) => {
    res.render("profile", {
      title: "Профиль",
      isProfile: true,
      user: req.user.toObject()  
    })
})

router.post("/", async (req, res) => {
    
})

module.exports = router
