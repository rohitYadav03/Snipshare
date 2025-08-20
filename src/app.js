const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config.js");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRoutes.js");
const { ProfileRouter } = require("./routes/profileRouter.js");
const { SnippetRouter } = require("./routes/snippetRouter.js");
require("dotenv").config();

const app = express();

// Safe CORS setup
const corsOptions = {
  origin: "https://snipshareapp.netlify.app",
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log("CORS headers:", res.getHeaders());
  });
  next();
});


app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/profile", ProfileRouter);
app.use("/snippets", SnippetRouter);

// DB and Server Start
connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
