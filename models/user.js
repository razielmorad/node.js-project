const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const { JWTSecretToken } = require("../configs/config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 120,
    required: true,
  },
  email: {
    type: String,
    minLength: 6,
    maxLength: 120,
    required: true,
  },
  password: {
    type: String,
    minLength: 2,
    maxLength: 120,
    required: true,
  },
  biz: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, biz: this.biz }, JWTSecretToken);
};

const User = mongoose.model("User", userSchema, "users");

const userValidate = (user) => {
  const schema = joi.object({
    name: joi.string().min(2).max(120).required(),
    email: joi.string().min(6).max(120).required().email(),
    password: joi.string().min(2).max(120),
    biz: joi.boolean(),
  });
  return schema.validate(user);
};
module.exports = {
  userValidate,
  User,
};
