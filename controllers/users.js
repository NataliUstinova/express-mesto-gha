const User = require('../models/user');
const bcrypt = require('bcryptjs');

const { STATUS, ERROR_MESSAGE, ERROR_NAME, MESSAGE } = require('../constants/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.NOT_FOUND.USER });
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.CAST) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.USER_GET });
      } else {
        res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.USER_CREATE });
      } else {
        res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
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
        res
          .status(STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.NOT_FOUND.USER });
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION || e.name === ERROR_NAME.CAST) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.USER_UPDATE });
      } else {
        res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
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
        res
          .status(STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.NOT_FOUND.USER });
      }
    })
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION || e.name === ERROR_NAME.CAST) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.AVATAR });
      } else {
        res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
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
    .catch(next);
}
