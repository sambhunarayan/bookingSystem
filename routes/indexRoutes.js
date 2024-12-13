// routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
// validator
const {
	bookingDateValidator,
	bookingValidator,
} = require('../helpers/validation');
// load home page
router.get('/', indexController.index);
// get booking slots
router.post('/slots', bookingDateValidator, indexController.getSlotsForBooking);
router.post('/book', bookingValidator, indexController.postBookSlot);
router.get('/checkSlot', bookingValidator, indexController.checkSlot);
module.exports = router;
