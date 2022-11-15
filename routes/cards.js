const router = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getAllCards);

router.post('/', auth, createCard);

router.delete('/:cardId', auth, deleteCard);

router.put('/:cardId/likes', auth, likeCard);

router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
