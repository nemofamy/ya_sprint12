const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();

const cards = require('./routes/cards');
const users = require('./routes/users');

app.use(express.static('public'));
app.use(express.json());

app.use('/', cards);
app.use('/', users);

app.listen(PORT);
