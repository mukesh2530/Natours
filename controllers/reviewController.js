const Review = require('./../models/reviewModel');
const factory = require('./factoryHandller');

exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourid) filter = { tour: req.params.tourid };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     result: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.findTourAndId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
// exports.createReviews = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourid;
//   if (!req.body.user) req.body.user = req.user.id;
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });
exports.getReview = factory.getOne(Review);
exports.createReviews = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
