require("dotenv").config();

const MONGO_URI = `mongodb+srv://rdev82638:${process.env.PASSWORD}@todos.kaaojbm.mongodb.net/`;
const APP_PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET;

module.exports = { MONGO_URI, APP_PORT, SECRET_KEY };
