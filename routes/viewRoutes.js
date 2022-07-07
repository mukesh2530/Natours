const express = require('express');
const router = express.Router();
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

router.get('/', authController.isLoggedin, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedin, viewsController.getTour);
router.get('/login', authController.isLoggedin, viewsController.getLogin);
router.get('/me', authController.protect, viewsController.getAccount);
router.post(
  '/user-data-update',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
