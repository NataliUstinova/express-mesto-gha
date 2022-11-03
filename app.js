
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 }= process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb.mestodb', {
  useNewUrlParser: true,
});

// подключаем мидлвары, роуты и всё остальное...

app.listen(PORT);
