const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-req-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const DUPLICATE_ERROR_CODE = 11000;

// GET /users — возвращает всех пользователей
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при поиске'));
    } else {
      next(err);
    }
  }
};

// POST /users — создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Переданы некорректные данные при создании пользователя');
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.send({ message: 'Регистрация прошла успешно!', _id: user._id, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.send(user);
    } else {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  }
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me/avatar — обновляет аватар
exports.updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.send(user);
    } else {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    } else {
      next(err);
    }
  }
};

// Логин пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка аутентификации'));
    });
};
