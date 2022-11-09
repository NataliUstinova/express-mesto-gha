const {ERROR_MESSAGE} = require("../constants/constants");

class AuthError extends Error {
  constructor(message) {
    super(message || ERROR_MESSAGE.AUTH_ERROR);
    this.statusCode = 401;
  }
}

module.exports = AuthError;
