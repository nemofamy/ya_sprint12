const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Вы неавторизованы' });
  }
  const token = authorization.replace('Bearer', '');

  let payload;
  try {
    payload = jwt.verify(token, '1');
  } catch (err) {
    return res.status(401).send({ message: 'Вы неавторизованы' });
  }
  req.user = payload;
  next();
};