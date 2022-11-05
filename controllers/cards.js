const Card = require('../models/card');
const { STATUS, ERROR_MESSAGE, ERROR_NAME } = require('../constants/constants');

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
    if (e.name === ERROR_NAME.VALIDATION) {
      res
        .status(STATUS.BAD_REQUEST)
        .send({ message: ERROR_MESSAGE.BAD_REQUEST.CARD });
    }
    res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
  });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      }
      if (!card) {
        res
          .status(STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.NOT_FOUND.CARD });
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.CAST) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.CARD });
      }
      res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  {
    new: true,
    runValidators: true,
  },
).then((card) => {
  if (card) {
    res.send(card);
  }
  if (!card) {
    res
      .status(STATUS.NOT_FOUND)
      .send({ message: ERROR_MESSAGE.NOT_FOUND.CARD });
  }
})
  .catch((e) => {
    if (e.name === ERROR_NAME.CAST) {
      res
        .status(STATUS.BAD_REQUEST)
        .send({ message: ERROR_MESSAGE.BAD_REQUEST.CARD });
    }
    res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  {
    new: true,
    runValidators: true,
  },
).then((card) => {
  if (card) {
    res.status(STATUS.OK).send(card);
  } else if (!card) {
    res
      .status(STATUS.BAD_REQUEST)
      .send({ message: ERROR_MESSAGE.BAD_REQUEST.CARD_LIKES });
  }
})
  .catch((e) => {
    if (e.name === ERROR_NAME.VALIDATION) {
      res
        .status(STATUS.BAD_REQUEST)
        .send({ message: ERROR_MESSAGE.BAD_REQUEST.CARD_LIKES });
    }
    if (e.name === ERROR_NAME.CAST) {
      res
        .status(STATUS.NOT_FOUND)
        .send({ message: ERROR_MESSAGE.NOT_FOUND.CARD });
    }
    res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
  });
