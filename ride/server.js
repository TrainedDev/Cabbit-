const express = require("express");
const cors = require("cors");
const { route: rideRoute } = require("./routes/rideRoute");
const { sequelize } = require("./models");
const cookiesParser = require("cookie-parser");
require("dotenv").config();
require('pg'); 

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
    credentials: true,
}));
app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded());

app.use("/ride", rideRoute);
app.get("/", (req, res) => res.send("server is live"));

sequelize.authenticate().then(() => console.log("successfully connected to the database")).catch((error) => console.log("failed to connect database", error));

app.listen(PORT, () => console.log("server is ready", PORT));