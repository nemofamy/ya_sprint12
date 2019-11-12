const router = require('express').Router();

const {
  getUsers,
  getUserById,
  postUser,
  changeProfile,
  changeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', postUser);
router.patch('/users/me', changeProfile);
router.patch('/users/me/avatar', changeAvatar);

// на случай непонятного запроса
router.get('/:strangeRequest', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
