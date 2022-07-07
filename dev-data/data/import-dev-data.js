const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

// DB CONNECTION
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('connection has been establized');
  })
  .catch((err) => {
    console.log(err);
  });
// READ JSON FILE
const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');

const tourObj = JSON.parse(tours);
const userObj = JSON.parse(users);
const reviewObj = JSON.parse(reviews);

// IMPORT DATA TO DB
const importData = async () => {
  try {
    await Tour.create(tourObj);
    await User.create(userObj, { validateBeforeSave: false });
    await Review.create(reviewObj);

    console.log('data imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// DELETE DATA
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// CONDITIONS
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// console.log(process.argv);
