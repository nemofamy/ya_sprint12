const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const cards = require('./routes/cards');
const users = require('./routes/users');

app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '5dcadf931a40fd3c9dc88cee',
  };

  next();
});

app.use('/', cards);
app.use('/', users);

app.listen(PORT);
