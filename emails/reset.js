const keys = require("../keys");

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Ввостановление доступа",
    html: `
        <h1>Вы забыли пароль?</h1>
        <p>Если нет, то проигнарируйте данное письмо </p>
        <p>Иначе нажмите на ссылку ниже:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Ввостановить доступ</a></p>
        
        <he />
        <a href="${keys.BASE_URL}">Online clothing store</a>
        `,
  };
};
