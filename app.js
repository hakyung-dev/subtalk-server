if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT');
}
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const socketIO = require('socket.io');

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
app.io = socketIO();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', indexRouter);

// socket
app.io.on('connection', (socket) => {
  console.log('socket connected : ', socket.id);

  socket.on('enter room', (roomNo, user) => {
    socket.join(roomNo);
    const date = new Date().toString();
    const message = {
      text: `${user.name}님이 입장하셨습니다.`,
      time: date.slice(16, 21),
    };
    app.io.to(roomNo).emit('anounce', message);
  });

  socket.on('typing', (roomNo, user) => {
    socket.broadcast.to(roomNo).emit('who typing', user.name);
  });

  socket.on('send message', (roomNo, user, message) => {
    app.io.to(roomNo).emit('receive message', user, message);
  });

  socket.on('out room', (roomNo, user) => {
    socket.leave(roomNo);
    const date = new Date().toString();
    const message = {
      text: `${user.name}님의 접속이 끊어졌습니다.`,
      time: date.slice(16, 21),
    };
    app.io.to(roomNo).emit('anounce', message);
  });
});

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
