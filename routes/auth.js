const express = require("express");
const { User } = require("../models/user");
const route = express.Router();
const bcrypt = require("bcrypt");
const joi = require("joi");

route.get("/", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("user does not exist");
  }

  const isValid = await bcrypt.compare(req.body.password, user.password);

  if (!isValid) {
    res.status(400).send("password is not valid");
    return;
  }
const token = user.generateAuthToken()

res.send({token})



});

const Validate = (user) => {
  const schema = joi.object({
    email: joi.string().min(6).max(120).required().email(),
    password: joi.string().min(2).max(120),
  });
  return schema.validate(user);
};

module.exports = route;
