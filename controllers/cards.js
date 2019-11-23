const Card = require('../models/card');
const { BadRequestError, InternalServerError, ForbiddenError } = require('../errors/allErrors');

const BadRequest = (req, res, next) => {
  req.then((cards) => {
    if (!cards) {
      throw new BadRequestError('Фигня случается');
    }
    res.status(201).send({ data: cards });
  }).catch(next);
};

const InternalServerErrorRequest = (req, res, next) => {
  req.then((user) => {
    if (!user) {
      throw new InternalServerError('Фигня случается. И с сервером тоже');
    }
    res.status(200).send({ data: user });
  }).catch(next);
};

module.exports.getCards = (req, res) => {
  BadRequest(Card.find({}), res);
};

module.exports.postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  BadRequest(Card.create({ name, link, owner }), res);
};

module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((user) => {
      if (user.owner.equals(req.user._id)) {
        InternalServerErrorRequest(Card.findByIdAndRemove(cardId), res);
      } else if (user.length <= 0) {
        throw new ForbiddenError('Нечего удалять');
      } else {
        throw new ForbiddenError('Не ваша карточка, нечго и трогать');
      }
    }).catch(next);
};

module.exports.addLike = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  InternalServerErrorRequest(
    Card.findByIdAndUpdate(
      cardId, { $addToSet: { likes: owner } }, { new: true }
    ), res
  );
};

module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  InternalServerErrorRequest(
    Card.findByIdAndUpdate(
      cardId, { $pull: { likes: owner } }, { new: true }
    ), res
  );
};
