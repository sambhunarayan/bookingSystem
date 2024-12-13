const pool = require('../config/dbConnection');
// configure log
var log4js = require('log4js');
// Loggers for general info and error logging
var log = log4js.getLogger('indexModels');
const errorLog = log4js.getLogger('error');
log4js.configure('./log.json');
class indexModels {
	async insertBooking(slot, bookName, phone) {
		log.info('indexModels:insert booking into database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'INSERT INTO tb_booking(slot,bookName,phone)VALUES(?,?,?)',
				[slot, bookName, phone],
			);
			return results;
		} catch (error) {
			throw error;
		} finally {
			// Ensure the connection is always released back to the pool
			if (connection) {
				pool.release(connection);
				log.info('Database connection released');
			}
		}
	}
	async fetchBookingDate(slot) {
		log.info('indexModels:fetch booking date from database');
		let connection;
		try {
			connection = await pool.acquire();
			const [results] = await connection.query(
				'SELECT slot FROM tb_booking WHERE slot=?',
				[slot],
			);
			return results;
		} catch (error) {
			throw error;
		} finally {
			// Ensure the connection is always released back to the pool
			if (connection) {
				pool.release(connection);
				log.info('Database connection released');
			}
		}
	}
}
module.exports = indexModels;
