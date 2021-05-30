const Card = require('../models/card');
const MestoError = require('../errors/MestoError');

module.exports.getCards = (_, res, next) => {
  Card.find({})
    .sort('-createdAt')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.deleteOne({ _id: req.params.cardId, owner: req.user })
    .then((data) => {
      if (data.ok !== 1) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return Promise.reject(new MestoError());
      }
      if (data.deletedCount === 1) {
        return res.send({ message: 'Карта успешно удалена' });
      }
      return Promise.reject(new MestoError(404, `вы не являетесь владельцем карты с идентификатором id ${req.params.cardId} !`));
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate('likes')
    .then((card) => {
      if (!card) {
        return Promise.reject(new MestoError(404, `Карта с id ${req.params.cardId} не найдена!`));
      }
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  ).populate('likes')
    .then((card) => {
      if (!card) {
        return Promise.reject(new MestoError(404, `Карта с id ${req.params.cardId} не найдена!`));
      }
      return res.send({ data: card });
    })
    .catch(next);
};
