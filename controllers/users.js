const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

const {
  ERROR_MESSAGE, ERROR_NAME, MESSAGE,
} = require('../constants/constants');
const BadRequestError = require('../errors/bad-request-err');
const EmailExistError = require("../errors/email-exist-err");
const AuthError = require("../errors/auth-err");

const { NODE_ENV, JWT_SECRET } = process.env;

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

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({name: user.name, about: user.about, avatar: user.avatar, email: user.email}))
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION) {
        next(new BadRequestError(ERROR_MESSAGE.BAD_REQUEST.USER_CREATE));
      } else if (e.code === 11000) {
        next(new EmailExistError('Email exist'))
      } else {
        next(e);
      }
    });
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
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: MESSAGE.AUTH_SUCCESS });
    })
    .catch(e => {
      next(e);
    });
};
