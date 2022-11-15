const router = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { auth } = require('../middlewares/auth');
const { celebrate, Joi } = require("celebrate");
const {urlValidatorPattern} = require("../constants/constants");
Joi.objectId = require('joi-objectid')(Joi);

router.get('/', auth, getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(urlValidatorPattern),
  })
}), auth, createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId,
  })
}), auth, deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId,
  })
}), auth, likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId,
  })
}), auth, dislikeCard);

module.exports = router;
