const router = require('express').Router();
const path = require('path');
const fs = require('fs');

const users_data = require('../data/users');

const sendUserById = (req, res) => {
    // перебираем пользователей и сравниваем их id с запрошенным
    for (let i = 0; i < users_data.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (users_data[i]._id === req.params.id) {
        res.send(users_data[i]);
        return; // если нашли - выходим из перебора
      }
    }
    // если не нашли - шлем 404
    res.status(404).send({ message: 'Нет пользователя с таким id' });
};

router.get('/users', (req, res) => {
  res.send(users_data);
});
router.get('/users/:id', sendUserById);

// на случай непонятного запроса
router.get('/:strangeRequest', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
