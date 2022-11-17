const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const loginRouter = require('./login');
const NotFoundError = require('../errors/not-found-err');
const { ERROR_MESSAGE } = require('../constants/constants');

// server crash test
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use(loginRouter);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => { next(new NotFoundError(ERROR_MESSAGE.NOT_FOUND.PAGE)); });

module.exports = router;
