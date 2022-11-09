const { ERROR_MESSAGE } = require('../constants/constants');

class DefaultError extends Error {
  constructor(message) {
    super(message || ERROR_MESSAGE.DEFAULT_ERROR);
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
