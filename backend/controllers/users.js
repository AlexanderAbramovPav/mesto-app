const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-req-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const DUPLICATE_ERROR_CODE = 11000;

// GET /users — return all users
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:userId - return the user by _id
module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('The user with the specified id was not found');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Incorrect data was transmitted during the search'));
    } else {
      next(err);
    }
  }
};

// POST /users — create a user
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.send({ message: 'Registration was successful!', _id: user._id, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data was transmitted when creating a user'));
      } else if (err.code === DUPLICATE_ERROR_CODE) {
        next(new ConflictError('The user with this email already exists'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me — update the profile
module.exports.UpdateUser = async (req, res, next) => {
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
      throw new NotFoundError('The user with the specified id was not found');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Incorrect data was transmitted when updating the profile'));
    } else {
      next(err);
    }
  }
};

// GET /users/me - return information about the current user
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me/avatar — update the avatar
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
      throw new NotFoundError('The user with the specified id was not found');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Incorrect data was transmitted when updating the avatar'));
    } else {
      next(err);
    }
  }
};

// User login
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
        .send({ message: 'Authorization was successful!' });
    })
    .catch(() => {
      next(new UnauthorizedError('Authentication error'));
    });
};
