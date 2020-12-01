const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  // const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(err);
  const message = `Duplicate field value: ${err.keyValue.name},  Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');
  const message = `Invalid input data. ${errors}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please login again', 401);

const handleTokenExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  console.error('Error: ', err);

  //RENDERED SITE
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};

const sendErrorProduction = (err, req, res) => {
  //API ERROR
  if (req.originalUrl.startsWith('/api')) {
    //Operational/Trusted error, send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    //Programming or other unknown error : don't send to client
    //1) Log error
    console.error('Error: ', err);
    //2)Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
  //RENDERED SITE
  //Operational/Trusted error, send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
  //Programming or other unknown error : don't send to client
  //1) Log error
  console.error('Error: ', err);
  //2)Send generic message
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProduction(error, req, res);
  }

  next();
};
