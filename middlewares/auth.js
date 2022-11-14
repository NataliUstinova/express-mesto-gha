const jwt = require('jsonwebtoken');
// // const { JWT_SECRET } = require('../constants/constants');
const AuthError = require('../errors/auth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { JWT_SECRET = 'strongest-key-ever' } = process.env;
  const { authorization } = req.headers;
  // Проверяем есть ли заголовок и начинается ли он с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }
  // Отделяем токен от Bearer
  const token = authorization.replace('Bearer ', '');
  let payload;

  // Чтобы отловить ошибки оборачиваем в try-catch
  try {
    // Вытаскиваем айди из токена
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
