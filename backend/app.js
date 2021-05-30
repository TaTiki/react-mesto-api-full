const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const MestoError = require('./errors/MestoError');
const { urlValidator } = require('./errors/customValidationError');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorMiddleware = require('./middleware/handleError');

const { DB = 'mongodb://localhost:27017/mestodb', NODE_ENV, JWT_SECRET } = process.env;
const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger); // подключаем логгер запросов

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidator),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req) => {
  throw new MestoError(404, `Не можем найти ${req.path} маршрут`);
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log(DB);
  console.log(NODE_ENV);
  console.log(JWT_SECRET);
  console.log('Server started');
});
