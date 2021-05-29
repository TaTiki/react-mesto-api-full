const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MestoError = require('../errors/MestoError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

function getUserById(res, _id, next) {
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(404, `Пользователь с id ${_id} не найден!`));
      }
      return res.send({ data: user });
    }).catch(next);
}

module.exports.getUser = (req, res, next) => {
  getUserById(res, req.params.userId, next);
};

module.exports.getMe = (req, res, next) => {
  getUserById(res, req.user._id, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then((user) => {
        user.set('password', undefined);
        res.send({ data: user });
      }))
    .catch(next);
};

module.exports.updateMe = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate({ _id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(404, 'Такого профиля нет в базе данных!'));
      }
      return res.send({ data: user });
    }).catch(next);
};

module.exports.updateMyAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate({ _id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(404, 'Такого профиля нет в базе данных!'));
      }
      return res.send({ data: user });
    }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(401));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new MestoError(401));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
