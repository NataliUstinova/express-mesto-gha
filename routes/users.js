const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
Joi.objectId = require('joi-objectid')(Joi);
const urlValidator =  require('../utils/utils')

const {
  getUserById, getAllUsers, updateUserInfo, updateAvatar, createUser, login,
} = require('../controllers/users');

// роуты, не требующие авторизации, регистрация и логин
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // avatar: Joi.string().regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/),
    avatar: Joi.string().custom(urlValidator),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
    // Minimum 5 characters, at least one letter and one number:
    password: Joi.string().required(),
  }),
}), login);

// роуты с авторизацией
router.get('/users', auth, getAllUsers);

router.get('users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId,
  }),
}), getUserById);

router.patch('users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUserInfo);

router.patch('users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(((ftp|http|https):\/\/)|(\/)|(..\/))(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/),
  }),
}), auth, updateAvatar);

module.exports = router;
