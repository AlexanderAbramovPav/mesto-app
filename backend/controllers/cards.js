const Card = require('../models/card');

const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// GET /cards — return all cards
module.exports.getCards = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 16;
    const skip = (page - 1) * limit;
    const totalCards = await Card.find({});
    const cards = await Card.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const cardsLength = totalCards.length;
    res.send({ cardsLength, page, cards });
  } catch (err) {
    next(err);
  }
};

// POST /cards — create a card
module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user._id });
    res.send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Incorrect data was transmitted when creating the card'));
    } else {
      next(err);
    }
  }
};

// DELETE /cards/:CardID — delete the card by the ID
module.exports.deleteCardById = async (req, res, next) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (req.user._id === deletedCard.owner._id.toString()) {
        await Card.findByIdAndRemove(req.params.cardId);
        res.send({ message: 'The following card data has been deleted', deletedCard });
      } else {
        throw new ForbiddenError('You cant delete someone else card');
      }
    } else {
      throw new NotFoundError('Card not found');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid card id was passed'));
    } else {
      next(err);
    }
  }
};

// PUT /cards/:CardID/likes — like the card
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
      throw new NotFoundError('Card not found by specified id');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid card id was passed'));
    } else {
      next(err);
    }
  }
};

// DELETE /cards/:CardID/likes — remove the like from the card
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
      throw new NotFoundError('Card not found by specified id');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid card id was passed'));
    } else {
      next(err);
    }
  }
};
