const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const User = require("../models/user-model");
const keys = require("../keys");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const { loginValidators, registerValidators } = require("../utils/validators");

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

router.post("/login", loginValidators, async (req, res) => {
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

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

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
  } catch (err) {
    console.log(err);
  }
});

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Ввостановление пароля",
    error: req.flash("error"),
  });
});

router.get("/password/:token", async (req, res) => {
  if (req.params.token) {
    return res.redirect("/auth/login");
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect("auth/login");
    } else {
      res.render("auth/password", {
        title: "Замена пароля",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (err) {
    console.log(err);
  }
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
        req.flash("error", "Данный email не верный или не зарегистрирован");
        res.redirect("/auth/reset");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/password", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcryptjs.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/auth/login");
    } else {
      req.flash("loginError", "Время жизни ссылки истекло");
      res.redirect("/auth/login");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
