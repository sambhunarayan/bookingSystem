// Validation for API
// configure log
var log4js = require('log4js');
var log = log4js.getLogger('validation');
log4js.configure('./log.json');
const { check } = require('express-validator');
exports.bookingDateValidator = [
	check('bookingDate', 'Date is required').not().isEmpty(),
	check('bookingDate', 'Date must not be in the past').custom(value => {
		const inputDate = new Date(value);
		const currentDate = new Date();
		// Remove time from currentDate for comparison
		currentDate.setHours(0, 0, 0, 0);
		if (inputDate < currentDate) {
			throw new Error('Date must not be in the past');
		}
		return true;
	}),
];
exports.bookingValidator = [
	check('slot', 'Booking date is missing').not().isEmpty(),
	check('bookName', 'Name is required').not().isEmpty(),
	check('phone', 'Phone number is required')
		.not()
		.isEmpty()
		.withMessage('Phone number is required')
		.isLength({ min: 10, max: 10 })
		.withMessage('Phone number must be 10 digits long')
		.isNumeric()
		.withMessage('Phone number must be numeric'),
];
