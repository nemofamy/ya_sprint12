const router = require('express').Router();
const path = require('path');
const fs = require('fs');

const cards_data = require('../data/cards');

router.get('/cards', (req, res) => {
  res.send(cards_data);
});
module.exports = router;
