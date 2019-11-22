const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  postCard,
  removeCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/^(https?:\/\/)(www\.)?(([\w-]{2,}[\.][a-zA-Z]{2,})|((\d{3}\.){3}\d{3}))(:\d{2,5})?([\/]{1}\w*)*#?$/)
    })
  }), postCard
);
router.delete(
  '/:cardId',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().length(24)
    })
  }),
  removeCard
);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
