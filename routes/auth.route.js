const express = require('express');
const router = express.Router();
const SchemaValidator = require('../middlewares/SchemaValidator');
const validateRequest = SchemaValidator(true);
const passport = require('passport');
const usePassport = require('../usePassport');

usePassport(passport);

const userController = require('../controllers/user.controller');

router.get('/:wallet_address', userController.getUser);
router.get('/:wallet_address/nonce', userController.getUserNonce);
router.post('/register', userController.registerUser);
router.post('/signature', userController.signature);
router.post(
  '/set_username',
  passport.authenticate('jwt', { session: false }),
  userController.setUserName
);
// router.post('/update_user', validateRequest, userController.updateUser);

module.exports = router;
