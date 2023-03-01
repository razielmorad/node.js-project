const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/users");
const userAuth = require("./routes/auth");
const cardRoute = require("./routes/cards");
require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/new_rest_api")
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("could not connect to mongodb"));

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use("/auth", userAuth);
app.use("/cards", cardRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
