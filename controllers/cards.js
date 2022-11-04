const Card = require('../models/card');
const mongoose = require("mongoose");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then(
    (card) => res.send(card),
  ).catch((e) => {
    if (e instanceof mongoose.Error.ValidationError) {

      return res

        .status(400)

        .send({ message: "ERRORS.badRequest.errorMessage" });

    }
    console.log(e)
    res.status(500).send({ message: 'Произошла ошибка добавления карточки' })
  });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId).then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка удаления карточки' }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id  } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => res.send(card))
  .catch(() => {
    res.status(500).send({message: 'Произошла ошибка лайка карточки'})
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id  } }, // убрать _id из массива
  { new: true },
).then((card) => res.send(card))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка дизлайка карточки' }));
