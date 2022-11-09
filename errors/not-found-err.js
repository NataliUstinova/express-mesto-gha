const { ERROR_MESSAGE } = require("../constants/constants");

class NotFoundError extends Error {
  constructor(message) {
    super(message || ERROR_MESSAGE.NOT_FOUND.PAGE);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
