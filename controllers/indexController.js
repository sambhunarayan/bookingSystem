// configure log
var log4js = require('log4js');
var log = log4js.getLogger('Index controller');
var errorLog = log4js.getLogger('error');
log4js.configure('./log.json');
const utils = require('../config/utils.js');
const models = require('../models/indexModels.js');
const moment = require('moment');
const indexModels = new models();
// Module to validate fields
const { validationResult } = require('express-validator');
exports.index = (req, res) => {
	try {
		res.render('index', { msg: '' });
	} catch (error) {
		log.error('An error occured', error);
		return res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};
// get slots for booking post method
exports.getSlotsForBooking = async (req, res) => {
	log.info('Index controller: get slots for booking POST method');

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render('index', {
				success: false,
				msg: 'Invalid date or date missing',
				errors: errors.array(),
			});
		}
		let { bookingDate } = req.body;
		const date = bookingDate;
		const intervalMinutes = 30;

		// Define time ranges
		const startMorning = moment(`${date}T10:00`); // 10:00 AM
		const endMorning = moment(`${date}T13:00`); // 1:00 PM
		const startEvening = moment(`${date}T14:00`); // 2:00 PM
		const endEvening = moment(`${date}T17:00`); // 5:00 PM

		const morningIntervals = [];
		const eveningIntervals = [];

		// Generate morning intervals
		while (
			startMorning.isBefore(endMorning) ||
			startMorning.isSame(endMorning)
		) {
			morningIntervals.push(startMorning.format('DD/MM/YYYY HH:mm'));
			startMorning.add(intervalMinutes, 'minutes');
		}

		// Generate evening intervals
		while (
			startEvening.isBefore(endEvening) ||
			startEvening.isSame(endEvening)
		) {
			eveningIntervals.push(startEvening.format('DD/MM/YYYY HH:mm'));
			startEvening.add(intervalMinutes, 'minutes');
		}

		// const data = await indexModels.fetchBookedSlots(bookingDate);
		bookingDate = moment(bookingDate).format('DD/MM/YYYY');
		res.status(200).json({
			success: true,
			data: {
				bookingDate: bookingDate,
				morningIntervals: morningIntervals,
				eveningIntervals: eveningIntervals,
			},
			msg: 'Slots fetched successfully',
		});
	} catch (error) {
		errorLog.error('An error occured', error);
		return res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};
// check slot before booking  get method
exports.checkSlot = async (req, res) => {
	log.info('Index controller:check slots GET method');

	try {
		let { slot } = req.query;
		console.log('checking slot', slot);
		const data = await indexModels.fetchBookingDate(slot);
		console.log('checkData', data.length);
		if (data.length === 1) {
			res.status(200).json({
				success: false,
				data: data,
				msg: 'Slot already booked',
			});
		} else {
			res.status(200).json({
				success: true,
				data: data,
				msg: 'Slot available',
			});
		}
	} catch (error) {
		errorLog.error('An error occured', error);
		return res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};
// book slot post method
exports.postBookSlot = async (req, res) => {
	log.info('Index controller:Book slots POST method');

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render('index', {
				success: false,
				msg: 'Invalid entry',
				errors: errors.array(),
			});
		}
		let { slot, bookName, phone } = req.body;
		const data = await indexModels.insertBooking(slot, bookName, phone);
		res.status(200).json({
			success: true,
			data: data,
			msg: 'Booked successfully',
		});
	} catch (error) {
		errorLog.error('An error occured', error);
		return res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};
