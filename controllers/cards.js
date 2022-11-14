const Card = require('../models/card');
const { ERROR_MESSAGE, ERROR_NAME } = require('../constants/constants');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then(
    (card) => res.send(card),
  ).catch((e) => {
    if (e.name === ERROR_NAME.VALIDATION) {
      next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.CARD));
    } else {
      next(e);
    }
  });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else if (card.owner !== req.user._id) {
        next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.CARD));
      } else {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND.CARD);
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.CAST) {
        next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.CARD));
      } else {
        next(e);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  {
    new: true,
    runValidators: true,
  },
).then((card) => {
  if (card) {
    res.send(card);
  } else {
    throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND.CARD_LIKES);
  }
})
  .catch((e) => {
    if (e.name === ERROR_NAME.CAST) {
      next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.CARD_LIKES));
    } else {
      next(e);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  {
    new: true,
    runValidators: true,
  },
).then((card) => {
  if (card) {
    res.send(card);
  } else {
    throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND.CARD_LIKES);
  }
})
  .catch((e) => {
    if (e.name === ERROR_NAME.CAST) {
      next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.CARD_LIKES));
    } else {
      next(e);
    }
  });
