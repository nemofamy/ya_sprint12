const router = require('express').Router();

const {
  getUsers,
  getUserById,
  changeProfile,
  changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', changeProfile);
router.patch('/me/avatar', changeAvatar);

// на случай непонятного запроса
router.get('/:strangeRequest', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
