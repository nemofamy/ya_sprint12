const router = require('express').Router();

const {
  getCards,
  postCard,
  removeCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:cardId', removeCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
