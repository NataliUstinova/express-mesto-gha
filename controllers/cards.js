const Card = require('../models/card');
const mongoose = require("mongoose");
const { STATUS, ERROR_MESSAGE } = require("../constants/constants");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then(
    (card) => res.send(card),
  ).catch((e) => {
    if (e instanceof mongoose.Error.ValidationError) {
      return res
        .status(STATUS.BAD_REQUEST)
        .send({ message: ERROR_MESSAGE.BAD_REQUEST.CARD });
    }
    res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR })
  });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId).then((card) => res.send(card))
    .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id  } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => res.send(card))
  .catch(() => {
    res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR })
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id  } }, // убрать _id из массива
  { new: true },
).then((card) => res.send(card))
  .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
