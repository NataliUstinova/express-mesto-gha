const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUserById, getAllUsers, getUserInfo, updateUserInfo, updateAvatar
} = require('../controllers/users');
const {urlValidatorPattern} = require("../constants/constants");

// роуты с авторизацией
router.get('/users', auth, getAllUsers);

router.get('/users/me', auth, getUserInfo);

router.patch('users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUserInfo);

router.get('users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId,
  }),
}), auth, getUserById);

router.patch('users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlValidatorPattern),
  }),
}), auth, updateAvatar);

module.exports = router;
