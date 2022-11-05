const User = require('../models/user');
const { STATUS, ERROR_MESSAGE, ERROR_NAME } = require('../constants/constants');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId, { runValidators: true })
    .then((user) => {
      if (user) {
        res.status(STATUS.OK).send(user);
      } else if (!user) {
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
      }
      res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS.OK).send(user))
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.USER_CREATE });
      }
      res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
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
    .then((user) => res.status(STATUS.OK).send(user))
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.USER_UPDATE });
      } else if (e.name === ERROR_NAME.CAST) {
        res
          .status(STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.NOT_FOUND.USER });
      }
      res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(STATUS.OK).send(user))
    .catch((e) => {
      if (e.name === ERROR_NAME.VALIDATION) {
        res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST.AVATAR });
      }
      if (e.name === ERROR_NAME.CAST) {
        res
          .status(STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGE.NOT_FOUND.USER });
      }
      res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR });
    });
};
