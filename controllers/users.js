const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NotFoundError, InternalServerError } = require('../errors/allErrors');

const InternalServerErrorRequest = (req, res, next) => {
  req.then((user) => {
    if (!user) {
      throw new InternalServerError('Фигня случается. И с сервером тоже');
    }
    res.status(200).send({ data: user });
  }).catch(next);
};

module.exports.getUsers = (req, res) => {
  InternalServerErrorRequest(User.find({}), res);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Нет такого пользователя');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch(next);
    });
};

module.exports.changeProfile = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  InternalServerErrorRequest(
    User.findByIdAndUpdate(owner, { name, about }, { runValidators: true }, { new: true }), res
  );
};

module.exports.changeAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  InternalServerErrorRequest(
    User.findByIdAndUpdate(owner, { avatar }, { new: true }), res
  );
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      res.cookie('jwt', token, { httpOnly: true });
      res.status(201).send({ user, token });
    })
    .catch(next);
};
