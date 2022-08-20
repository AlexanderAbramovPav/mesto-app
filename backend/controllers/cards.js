const Card = require('../models/card');

const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// GET /cards — возвращает все карточки
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

// POST /cards — создаёт карточку
module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user._id });
    res.send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    } else {
      next(err);
    }
  }
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCardById = async (req, res, next) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (req.user._id === deletedCard.owner._id.toString()) {
        await Card.findByIdAndRemove(req.params.cardId);
        res.send({ message: 'Следующие данные карточки были удалены', deletedCard });
      } else {
        throw new ForbiddenError('Чужую карточку не удалить');
      }
    } else {
      throw new NotFoundError('Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id карточки'));
    } else {
      next(err);
    }
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findById(req.params.cardId);
    if (likedCard) {
      const pressLike = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      );
      res.send(pressLike);
    } else {
      throw new NotFoundError('Карточка по указанному id не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id карточки'));
    } else {
      next(err);
    }
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const dislikedCard = await Card.findById(req.params.cardId);
    if (dislikedCard) {
      const pressLike = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
      res.send(pressLike);
    } else {
      throw new NotFoundError('Карточка по указанному id не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id карточки'));
    } else {
      next(err);
    }
  }
};
