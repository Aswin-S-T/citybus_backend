const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Database configuration
const db = require("./config/db");
const userRouter = require("./routes/userRouter");
const companyRouter = require("./routes/companies/comapnyRouter");
db.connect();

// Middlewares
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());

// Routes configuration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);

app.get("/", (req, res) => {
  res.send("Nodejs started....");
});

app.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});
