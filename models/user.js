const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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

module.exports = mongoose.model('user', userSchema);
