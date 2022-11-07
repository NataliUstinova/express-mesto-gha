const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /(((ftp|http|https):\/\/)|(\/)|(..\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter your Email'],
    validate: [validator.isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter Your Password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Email or password is incorrect'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Email or password is incorrect'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
