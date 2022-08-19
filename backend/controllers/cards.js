const Card = require('../models/card');

const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// GET /cards — возвращает все карточки
// module.exports.getCards = (req, res, next) => {
//   Card.find({})
//     .then((cards) => res.send(cards))
//     .catch(next);
// };

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

// POST /cards — создаёт карточку
// module.exports.createCard = (req, res, next) => {
//   Card.create(
//     { name: req.body.name, link: req.body.link, owner: req.user._id },
//   )
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы некорректные данные при создании карточки'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user._id });
    res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка при заполнении обязательных полей'));
    } else {
      next(err);
    }
  }
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
// module.exports.deleteCardById = (req, res, next) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (card === null) { throw new NotFoundError('Карточка по указанному id не найдена'); }
// if (card.owner.toString() !== req.user._id) {throw new ForbiddenError('Чужую карту не удалить');}
//       Card.findByIdAndRemove(req.params.cardId)
//         .then((resCard) => res.send(resCard))
//         .catch(next);
//       return true;
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Передан некорректный id карточки'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (req.user._id === deletedCard.owner._id.toString()) {
        await Card.findByIdAndRemove(req.params.cardId);
        res.status(200).send({ message: 'Следующие данные были удалены', deletedCard });
      } else {
        throw new ForbiddenError('Нет прав для удаления данного фото');
      }
    } else {
      throw new NotFoundError('Фото не найдено');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка удаления фото'));
    } else {
      next(err);
    }
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
// module.exports.likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true },
//   )
//     .then((card) => {
//       if (card === null) { throw new NotFoundError('Карточка по указанному id не найдена'); }
//       return res.send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Передан некорректный id карточки'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports.likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findById(req.params.cardId);
    if (likedCard) {
      const pressLike = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      );
      res.status(200).send(pressLike);
    } else {
      throw new NotFoundError('Фото с таким id не существует');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка проставления отметки'));
    } else {
      next(err);
    }
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
// module.exports.dislikeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true },
//   )
//     .then((card) => {
//       if (card === null) { throw new NotFoundError('Карточка по указанному id не найдена'); }
//       return res.send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Передан некорректный id карточки'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const dislikedCard = await Card.findById(req.params.cardId);
    if (dislikedCard) {
      const pressLike = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
      res.status(200).send(pressLike);
    } else {
      throw new NotFoundError('Фото с таким id не существует');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка проставления отметки'));
    } else {
      next(err);
    }
  }
};
