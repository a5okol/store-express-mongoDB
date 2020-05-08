const keys = require("../keys");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Регистрация просла успешно",
    html: `
        <h1>Добро пожаловать в наш магазин</h1>
        <p>Вы успешно создали аккаунт на email - ${email} </p>
        <he />
        <a href="${keys.BASE_URL}">Online clothing store</a>
        `,
  };
};
