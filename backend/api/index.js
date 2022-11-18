require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { requestLogger, errorLogger } = require('../middlewares/logger');

const regWebUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9()]{1,256}\b([-a-zA-Z0-9()@:%_+~#?&/=]*)/;

const { PORT = 3000 } = process.env;
const app = express();

// request logger
app.use(requestLogger);

app.use(
  cors({
    origin: [
      'https://alexander.abramov.nomoredomains.sbs',
      'http://alexander.abramov.nomoredomains.sbs',
    ],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-type', 'Accept'],
  }),
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to mongoDB
mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) throw err;
  },
);

// routes with no auth
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regWebUrl),
    }),
  }),
  createUser,
);

// auth
app.use(auth);

app.post('/logout', (req, res) => {
  const token = req.cookies.jwt;
  res
    .cookie('jwt', token, {
      maxAge: 1,
      httpOnly: true,
    })
    .send({ message: 'Success logout!' });
});

// rutes with auth
app.use('/users', require('../routes/users'));

app.use('/cards', require('../routes/cards'));

// 404 route
app.use('/*', (req, res, next) => {
  next(new NotFoundError('The request was made to a non-existent page'));
});

// set error logger
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Error on the server..' : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
