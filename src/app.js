const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config.js");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRoutes.js");
const { ProfileRouter } = require("./routes/profileRouter.js");
const { SnippetRouter } = require("./routes/snippetRouter.js");
require("dotenv").config();

const app = express();

// Proper CORS setup for Netlify + Render + Credentials
const corsOptions = {
  origin: "https://snipshareapp.netlify.app",
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

//  Additional headers to ensure compatibility (especially on Render)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://snipshareapp.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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
