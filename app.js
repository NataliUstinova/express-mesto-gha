const express = require('express');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const loginRouter = require('./routes/login');

const { STATUS, ERROR_MESSAGE } = require('./constants/constants');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(loginRouter);
app.use(auth)
app.use(userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => { res.status(STATUS.NOT_FOUND).send({ message: ERROR_MESSAGE.NOT_FOUND.PAGE }); });

// обработчик ошибок celebrate
app.use(errors());
// централизованный обработчик
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err)
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.listen(PORT);
