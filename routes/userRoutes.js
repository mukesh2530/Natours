const express = require('express');
const userControllers = require('./../controllers/userController');
const router = express.Router();
const authController = require('./../controllers/authController');
// NO NEED TO BE PROTECTED
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//  PROTECTION IS NECESSARY all routes are protected
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userControllers.uploadUserPhoto,
  userControllers.resizeUserPhoto,
  userControllers.updateMe
);
router.get('/me', userControllers.getMe, userControllers.getUser);
router.delete('/deleteMe', userControllers.deleteMe);

// RESTRICTED AND PROTECTED
router.use(authController.restrictedTo('admin'));
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);
module.exports = router;
