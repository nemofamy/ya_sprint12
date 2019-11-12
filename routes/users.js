const router = require('express').Router();

const usersData = require('../data/users');

const sendUserById = (req, res) => {
    for (let i = 0; i < usersData.length; i++) {
      // eslint-disable-next-line no-underscore-dangle
      if (usersData[i]._id === req.params.id) {
        res.send(usersData[i]);
        return; 
      }
    }
    res.status(422).send({ message: 'Нет пользователя с таким id' });
};

router.get('/users', (req, res) => {
  res.send(usersData);
});
router.get('/users/:id', sendUserById);

// на случай непонятного запроса
router.get('/:strangeRequest', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
