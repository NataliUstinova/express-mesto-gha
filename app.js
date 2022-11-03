const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', () => console.log('connected'));
//временная авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '6363fc42ac871e993a20a373'
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
