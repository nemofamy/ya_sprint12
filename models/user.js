const validator = require('validator');
const bcrypt = require('bcriptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Нужна действительная электронная почта!',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?(([\w-]{2,}[\.][a-zA-Z]{2,})|((\d{3}\.){3}\d{3}))(:\d{2,5})?([\/]{1}\w*)*#?$/.test(v);
      },
      message: (props) => `${props.value} - это не ссылка!`,
    },
    required: true,
  },
});

userSchema.statics.findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильная почта или пароль'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
