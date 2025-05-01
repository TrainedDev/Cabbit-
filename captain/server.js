require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { route: captainRoute } = require("./routes/captainRoute");
const { sequelize } = require("./models")
const cookiesParser = require("cookie-parser");
require('pg'); 

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
    credentials: true,
}));

app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// const uploadDir = path.resolve(__dirname, "uploads");

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdir(uploadDir, err => {
//         if (err) return console.log(err);
//     });
// };

app.get("/", (req, res) => res.send("server is live"));

app.use("/auth", captainRoute);

sequelize.authenticate().then(() => console.log("successfully connected to the database")).catch((error) => console.log("failed to connect database", error));

app.listen(PORT, () => console.log("server is ready:", PORT));