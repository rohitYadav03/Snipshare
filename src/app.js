const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config.js");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRoutes.js");
const { ProfileRouter } = require("./routes/profileRouter.js");
const { SnippetRouter } = require("./routes/snippetRouter.js");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5173", // ✅ NOT '*'
  credentials: true               // ✅ Required for cookies
}));



app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", ProfileRouter);
app.use("/snippets", SnippetRouter)


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
