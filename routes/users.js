const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUserById, getAllUsers, getUserInfo, updateUserInfo, updateAvatar, createUser, login,
} = require('../controllers/users');



// роуты с авторизацией
router.get('/users', getAllUsers);

router.patch('users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.get('/users/me', getUserInfo);

router.get('users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId,
  }),
}), getUserById);

router.patch('users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(((ftp|http|https):\/\/)|(\/)|(..\/))(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/),
  }),
}), updateAvatar);

module.exports = router;
