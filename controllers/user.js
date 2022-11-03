const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById({ userId })
    .then((user) => {
    res.status(200).send({data: user[0]})
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  })
}

module.exports.createUser = (req, res) => {
  const { name, about } = req.body;

  User.create({ name, about }).
    then((user) => {res.send({ data : user })})
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}
