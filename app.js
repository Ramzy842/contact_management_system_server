const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./utils/config");
const contactsRouter = require("./controllers/Contacts");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const unknownEndpoint = require("./middleware/unknownEndpoint");
const errorHandler = require("./middleware/errorHandler");
const tokenExtractor = require("./middleware/tokenExtractor");
const userExtractor = require("./middleware/userExtractor");

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI);

app.use(cors());
app.use(express.json());

app.use(tokenExtractor);
app.use("/api/login", loginRouter);
app.use("/api/contacts", userExtractor, contactsRouter);
app.use("/api/users", usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
