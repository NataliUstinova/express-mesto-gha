const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

const {
  ERROR_MESSAGE, ERROR_NAME,
} = require('../constants/constants');
const BadRequestError = require('../errors/bad-request-err');
const EmailExistError = require('../errors/email-exist-err');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND.USER);
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.CAST) {
        next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.USER_GET));
      } else {
        next(e);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  console.log(req.user);
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => res.send({ data: user[0] }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      }))
      .catch((e) => {
        if (e.code === 11000) {
          next(new EmailExistError('Email exist'))}
        if (e.name === ERROR_NAME.VALIDATION) {
          next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.USER_CREATE));
        } else {
          next(e);
        }
      });
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user._id;

  User.find({ _id })
    .then((user) => res.send({ data: user[0] }))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND.USER);
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION || e.name === ERROR_NAME.CAST) {
        next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.USER_UPDATE));
      } else {
        next(e);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND.USER);
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION || e.name === ERROR_NAME.CAST) {
        next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.AVATAR));
      } else {
        next(e);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, 'strongest-key-ever', { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch((e) => {
      next(e);
    });
};
