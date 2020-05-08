const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user-model");
const keys = require("../keys");
const regEmail = require("../emails/registration");

const router = new Router();

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY },
  })
); // создаем транспортер, который будет являться объектом служащим для отправки имейлов

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcryptjs.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Неверный пароль. Попробуйте еще раз");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Такого пользователя не существует");
      res.redirect("/auth/login#login");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, name, password, repeat } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      req.flash("registerError", "Пользователь с таким email уже существует");
      res.redirect("/auth/login#register");
    } else {
      const hachPassword = await bcryptjs.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hachPassword,
        cart: { items: [] },
      });
      await user.save(); // ждем когда пользователь сохраниться

      await transporter.sendMail(regEmail(email));
      res.redirect("/auth/login#login");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
