const express = require("express");
const { connectDB } = require("./config.js");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRoutes.js");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);


connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT, () => {
      console.log(`Running on port ${process.env.PORT}`); 
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
