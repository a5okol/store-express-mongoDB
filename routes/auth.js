const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user-model");
const keys = require("../keys");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");

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

router.get("/reset", async (req, res) => {
  res.render("auth/reset", {
    title: "Ввостановление пароля",
    error: req.flash("error"),
  });
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так, повторите попытку позже");
        return res.redirect("/auth/reset");
      }

      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect("/auth/login");
      } else {
        req.flash("error", "Такой email не зарегестрирован");
        res.redirect("/auth/reset");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
