const { body } = require("express-validator/check");
const User = require("../models/user-model");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Пользователь с таким email уже существует");
        }
      } catch (err) {
        console.log(err);
      }
    })
    .normalizeEmail(),
  body("password", "Пароль должен быть минимум 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли должны совпадать");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа")
    .trim(),
];

exports.loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Пользователь с таким email уже существует");
        }
      } catch (err) {
        console.log(err);
      }
    })
    .normalizeEmail(),
  body("password", "Пароль должен быть минимум 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
];

exports.productValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Минимальная длина названия должна быть 3 символа")
    .trim(),
  body("price").isNumeric().withMessage("Введите корректную цену"),
  body("img", "Введите корректный Url картинки").isURL(),
];
