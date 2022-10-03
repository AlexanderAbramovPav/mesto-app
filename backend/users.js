const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-req-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const DUPLICATE_ERROR_CODE = 11000;

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({ message: 'Регистрация прошла успешно!', _id: user._id, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else {
        next(err);
      }
    });
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка аутентификации'));
    });
};

// PATCH /users/me
module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
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

// GET /users/me
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// POST /logout
module.exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    res.cookie('jwt', token, {
      maxAge: 1,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
      .send({ message: 'Выход прошёл успешно!' });
  } catch (err) {
    next(err);
  }
};
