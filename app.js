const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utlis/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const { request } = require('express');
// hey
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// 1) Global MIDDLEWARE
//  set the headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// a) rate limiter middleware
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from the this ip please try after one hour',
});
app.use('/api', limiter);

// environment
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// use to recognized incoming request object ,req.body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// sanitization againest nosql query injection
app.use(mongoSanitizer());
// sanitization againsed xss
app.use(xss());
// http parameter pollution
app.use(
  hpp({
    whitelist: ['price', 'duration', 'difficulty', 'ratingAverage'],
  })
);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
// 3)ROUTES
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`the route ${req.originalUrl} is found on server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
