const app = require("./app");
const { APP_PORT } = require("./utils/config");

const PORT = APP_PORT || 3003;

app.listen(PORT, () => {
    console.log("listening on port " + PORT + "...");
})