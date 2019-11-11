const router = require('express').Router();

const cards_data = require('../data/cards');

router.get('/cards', (req, res) => {
  res.send(cards_data);
});
module.exports = router;
