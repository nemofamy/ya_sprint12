const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.removeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((user) => {
      if (req.user._id === user.owner) {
        Card.findByIdAndRemove(cardId)
          .then((user) => res.send({ data: user }))
          .catch((err) => res.status(500).send({ message: err.message }));
      } else {
        res.status(500).send({ message: 'Это не ваша карточка!' });
      }
    });
};

module.exports.addLike = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
