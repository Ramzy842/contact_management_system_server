const Contact = require("../models/Contact");
const User = require("../models/User");
const contactsRouter = require("express").Router();

contactsRouter.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({}).populate("user", {
      username: 1,
      phone: 1,
      contacts: 1,
    });
    return res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

contactsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const targetContact = await Contact.findById(id);
    if (!targetContact)
      return res.status(404).json({ error: "Contact not found" });
    else return res.json(targetContact);
  } catch (err) {
    console.error("Error fetching contact:", err);
    return res.status(500).json({ error: "Failed to fetch contact." });
  }
});

contactsRouter.post("/", async (req, res) => {
  try {
    if (!req.body.userId) return res.json({ error: "No userId provided." });
    if (!req.token)
      return res.status(401).json({ error: "No token provided." });
    if (!req.user) return res.status(401).json({ error: "Invalid token." });
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ error: "User not found." });
    const newContact = new Contact({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      user: user._id,
    });
    const savedContact = await newContact.save();
    user.contacts = user.contacts.concat(savedContact._id);
    await user.save();
    return res.status(201).json(savedContact);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

contactsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.token)
      return res.status(401).json({ error: "No token provided." });
    if (!req.user) return res.status(401).json({ error: "Invalid token." });

    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found." });
    if (contact.user.toString() !== req.user)
      return res
        .status(404)
        .json({ error: "Unauthorized to delete this contact." });
    await Contact.findByIdAndRemove(id);
    return res.status(204).end();
  } catch {
    return res.status(500).json({ error: "Couldn't delete contact" });
  }
});

contactsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.token)
      return res.status(401).json({ error: "No token provided." });
    if (!req.user) return res.status(401).json({ error: "Invalid token." });
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found." });
    if (contact.user.toString() !== req.user)
      return res
        .status(404)
        .json({ error: "Unauthorized to update this contact." });
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
      },
      { new: true }
    );
    return res.status(200).json(updatedContact);
  } catch {
    return res.status(500).json({ error: "Failed to update Contact." });
  }
});

module.exports = contactsRouter;
