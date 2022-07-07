const crypto = require('crypto');
const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');
userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please Provide email'],
    validate: [validator.isEmail, 'Please provide a valid email id'],
    lowercase: true,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Pleaase provide password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm password'],
    validate: {
      // only works for the create and save
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
// // document middleware works between getting the data and save it to database
userSchema.pre('save', async function (next) {
  // 1) runs only when the password is actually modified.note when we modifiy the email then this function will not run
  if (!this.isModified('password')) return next();
  // 2) hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  //   3) delete the confirm password
  this.passwordConfirm = undefined;
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
//query  middle ware
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JWTTtimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamps = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTtimestamp < changeTimestamps; //password changed
  }
  //   fasle means not changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
