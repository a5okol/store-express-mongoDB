const User = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  req.user = await User.findById(req.session.user.__id)
  next()
};
