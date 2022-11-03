const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      res.status(200).send(user).save()
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // new User({ name, about, avatar }).save();
  User.create({name, about, avatar})
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка в добавлении пользователя' }));
};
