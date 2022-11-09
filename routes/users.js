const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi)

const {
  getUserById, getAllUsers, updateUserInfo, updateAvatar,
} = require('../controllers/users');


router.get('/', getAllUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
      userId: Joi.objectId,
    })
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(((ftp|http|https):\/\/)|(\/)|(..\/))(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/)
    }
  )
}), updateAvatar);

module.exports = router;
