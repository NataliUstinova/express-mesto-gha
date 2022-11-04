const User = require('../models/user');
const { STATUS, ERROR_MESSAGE } = require("../constants/constants");
const mongoose = require("mongoose");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(STATUS.OK).send(user))
    .catch(() => res.status(STATUS.DEFAULT_ERROR).send({ message: ERROR_MESSAGE.DEFAULT_ERROR }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS.OK).send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res
          .status(STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGE.BAD_REQUEST });
      }
      res.status(STATUS.DEFAULT_ERROR).send({message: ERROR_MESSAGE.DEFAULT_ERROR})
    });
};
