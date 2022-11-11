const validator = require("validator");
const BadRequestError = require('../errors/bad-request-err')

const urlCheckMethod = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  // Если условие некорректно, то бросаем ошибку 400
  throw new BadRequestError("Введённый URL некорректный");
};

module.exports = urlCheckMethod;
