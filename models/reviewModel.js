const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'can not be empty'],
    },
    ratings: {
      type: Number,
      default: 4.2,
      min: [1, 'not less than 1'],
      max: [5, 'not more than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
// query middleware
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numRating: { $sum: 1 },
        numRatingsAverage: { $avg: '$ratings' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantiy: stats[0].numRating,
      ratingsAverage: stats[0].numRatingsAverage,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantiy: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', function () {
  // statics methods are available on model not on instance
  // Review.calAverageRatings=this.constructor.calAverageRatings
  this.constructor.calAverageRatings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
