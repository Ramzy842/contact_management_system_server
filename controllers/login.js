const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const { SECRET_KEY } = require("../utils/config");
const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
  const { password, username } = req.body;
  const user = await User.findOne({username});
  const passwordCorrect =
    user == null ? false : await bcryptjs.compare(password, user.passwordHash);
    if (!(user && passwordCorrect))
        return res.status(401).json({error: "Invalid username or password."})
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(userForToken, SECRET_KEY, {expiresIn: 60 * 60});
    return res.status(200).send({token, username: user.username, phone: user.phone, id: user._id})
});

module.exports = loginRouter;