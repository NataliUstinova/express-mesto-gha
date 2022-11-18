const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const cookieParser = require('cookie-parser');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  // Получаем токен из cookies


  let payload;

  // Чтобы отловить ошибки оборачиваем в try-catch
  try {
    cookieParser()
    console.log(req)
    console.log(req.cookie)
    console.log(req.cookies)
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
    const token = req.cookies.jwt;
    // Вытаскиваем айди из токена
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'strongest-key-ever');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
