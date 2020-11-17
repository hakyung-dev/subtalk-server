if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT');
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const { CLIENT_URL } = require('./config');
const indexRouter = require('./routes/index');

const app = express();

app.use(express.static('public'));
app.get('/', function (req, res) {
  res
    .status(200)
    .sendFile('index.html', { root: path.join(__dirname, '/index.html') });
});

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
