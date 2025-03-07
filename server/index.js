const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();

connectDb();

const app = express();
app
  .use(
    cors({
      origin: process.env.FRONTEND_BASE_URL,
      credentials: true,
    })
  )
  .use(express.json())
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(morgan(":method :url :status :res[content-length] - :response-time ms"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Port is running at ${PORT}`);
});
