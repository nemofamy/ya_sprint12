const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// здесь по аналогии с карточками
const sendUsers = (req, res) => {
  const dataPath = path.join(__dirname, '../data/users.json');
  fs.readFile(dataPath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('Что-то пошло не так с пользователями');
      // eslint-disable-next-line no-console
      console.log(err);
      return;
    }
    res.send(JSON.parse(data));
  });
};

const sendUserById = (req, res) => {
  const dataPath = path.join(__dirname, '../data/users.json');
  fs.readFile(dataPath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('Что-то пошло не так с пользователем по ID');
      // eslint-disable-next-line no-console
      console.log(err);
      return;
    }
    const users = JSON.parse(data);
    // перебираем пользователей и сравниваем их id с запрошенным
    for (let i = 0; i < users.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (users[i]._id === req.params.id) {
        res.send(users[i]);
        return; // если нашли - выходим из перебора
      }
    }
    // если не нашли - шлем 404
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  });
};

router.get('/users', sendUsers);
router.get('/users/:id', sendUserById);

// на случай непонятного запроса
router.get('/:strangeRequest', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
