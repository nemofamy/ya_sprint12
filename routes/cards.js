const router = require('express').Router();

const {
  getCards,
  postCard,
  removeCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', postCard);
router.delete('/cards/:cardId', removeCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
