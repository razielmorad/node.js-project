const express = require("express");
const { User, userValidate } = require("../models/user");
const route = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMw = require("../middleware/auth");

route.post("/new-user", async (req, res) => {
  const { error } = userValidate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("email already registered");
  }
  user = await new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
  }).save();

  res.send(_.pick(user, ["_id", "name", "email", "biz"]));
});

route.get("/my-user", authMw, async (req, res) => {
  const user = await User.findById({ _id: req.user._id },{password:0});
  res.send(user);
});

module.exports = route;
