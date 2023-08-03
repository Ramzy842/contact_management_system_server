const usersRouter = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User");

usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({}).populate('contacts', {firstName: 1, lastName: 1, phone: 1});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve users." });
  }
});

usersRouter.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('contacts', {firstName: 1, lastName: 1, phone: 1});
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve user." });
    }
  });

usersRouter.post("/", async (req, res) => {
  const { username, phone, password } = req.body;
  if (!username || !phone || !password)
    return res.json({ error: "Please enter all required fields." });
    // username validation
    if (username.length > 16)
    return res.json({ error: "Username is too long." });
    if (username.length < 5)
    return res.json({ error: "Username is too short." });
    // phone validation
    if (phone.length > 16)
    return res.json({ error: "Phone is too long." });
    if (phone.length < 7)
    return res.json({ error: "Phone is too short." });
    // password validation
    if (password.length < 12)
    return res.json({ error: "Password is not strong." });
    if (password.length > 24)
    return res.json({ error: "Password is too long."});
  try {
    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);
    const newUser = new User({
      username,
      phone,
      passwordHash,
    });
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch {
    return res.status(500).json({ error: "Failed to create user." });
  }
});

module.exports = usersRouter;
