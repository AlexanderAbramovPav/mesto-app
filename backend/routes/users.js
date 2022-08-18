const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, getUser,
} = require('../controllers/users');

const regWebUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+~#?&/=]*)/;

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regWebUrl),
  }),
}), createUser);

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regWebUrl),
  }),
}), updateAvatar);

module.exports = router;
