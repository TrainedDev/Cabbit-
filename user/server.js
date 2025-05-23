require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { route: userRoutes } = require("./routes/userRoutes");
const { sequelize } = require("./models");
const cookieParser = require("cookie-parser");
require('pg'); 

const app = express();
// const PORT = process.env.PORT || 3001;

app.use(cors({
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("server is live");
});

app.use("/auth", userRoutes);

sequelize.authenticate().then(() => console.log("Successfully connected to database")).catch(error => console.log("failed to connect database:", error))

const PORT = process.env.PORT || 10000; 

app.listen(PORT, "0.0.0.0", () => {    
  console.log(`Server running on port ${PORT}`);
});