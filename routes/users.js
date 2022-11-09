const router = require('express').Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUserById, getAllUsers, updateUserInfo, updateAvatar, createUser, login,
} = require('../controllers/users');

// роуты, не требующие авторизации, регистрация и логин
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({minDomainSegments: 2, tlds: {allow: false}}),
    //Minimum 5 characters, at least one letter and one number:
    password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,30}$/),
  })
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false} }),
    //Minimum 5 characters, at least one letter and one number:
    password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,30}$/),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(/(((ftp|http|https):\/\/)|(\/)|(..\/))(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/),
  })
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
