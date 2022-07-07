const Tour = require('./../models/tourModel');
const catchAsync = require('./../utlis/catchAsync');
const AppError = require('./../utlis/appError');
const User = require('./../models/userModel');
exports.getOverview = async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
};
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review user rating',
  });
  if (!tour) {
    return next(new AppError('NO tour found with this name', 400));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tours`,
    tour,
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'get login to your account',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'get your details',
  });
};
exports.updateUserData = async (req, res, next) => {
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'user data updated',
    user: updatedUser,
  });
};
