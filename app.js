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

const auth = require('./middlewares/auth');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const users = require('./routes/users');

app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', cards);
app.use('/users', users);

app.listen(PORT);
