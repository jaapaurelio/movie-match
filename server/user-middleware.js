var uniqid = require("uniqid");

module.exports = function(req, res, next) {
  if (!req.cookies.user) {
    req.cookies.user = uniqid();
  }

  next();
};
