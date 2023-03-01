const express = require("express");
const { generateBizNum, Card, validateCard } = require("../models/card");
const route = express.Router();
const authMw = require("../middleware/auth");


route.post("/new", authMw, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://cdn.pixabay.com/photo/2018/05/17/20/08/career-3409564_1280.png",
    bizNumber: await generateBizNum(),
    user_id: req.user._id,
  }).save();
  res.send(card);
});

route.get("/all", authMw, async (req, res) => {
  const allCards = await Card.find({ user_id: req.user._id });
  if (!allCards) {
    res.status(400).send("no cards were found");
    return;
  }
  res.send(allCards);
});

route.put("/:id", authMw, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const card = await Card.findByIdAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    {
      ...req.body,
      bizImage:
        req.body.bizImage ||
        "https://cdn.pixabay.com/photo/2018/05/17/20/08/career-3409564_1280.png",
    },
    { new: true }
  );
  if (!card) {
    res.status(400).send("the card with the given id was not found");
    return;
  }
  res.send(card);
});

route.get("/:id", authMw, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(400).send("the card with the given id was not found");
    return;
  }
  res.send(card);
});

route.delete("/:id", authMw, async (req, res) => {
  const card = await Card.findByIdAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(400).send("the card with the given id was not found");
    return;
  }
  res.send(card);
});

module.exports = route;
