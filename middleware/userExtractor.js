const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");
const userExtractor = (req, res, next) => {
    req.user = jwt.verify(req.token, SECRET_KEY).id;
  next();
};

module.exports = userExtractor;
