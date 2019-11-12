const router = require('express').Router();

const cardsData = require('../data/cards');

router.get('/cards', (req, res) => {
  res.send(cardsData);
});
module.exports = router;
