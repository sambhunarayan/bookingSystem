// configure log
var log4js = require('log4js');
var log = log4js.getLogger('dbConnection');
log4js.configure('./log.json');
const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');
const { createPool } = require('generic-pool');

// Create a MySQL connection pool
const pool = createPool(
	{
		create: async function () {
			try {
				const connection = await mysql.createConnection({
					host: dbConfig.host,
					user: dbConfig.user,
					password: dbConfig.password,
					database: dbConfig.database,
					timezone: dbConfig.timezone,
					multipleStatements: true,
					keepAliveInitialDelay: 10000, // 0 by default
					enableKeepAlive: true, // false by default
				});

				connection.on('error', async err => {
					log.error('MySQL connection error:', err);
					if (
						err.code === 'PROTOCOL_CONNECTION_LOST' ||
						err.code === 'ECONNRESET'
					) {
						log.info('Attempting to reconnect...');
						await this.create();
					}
				});
				return connection;
			} catch (error) {
				log.error('Error creating MySQL connection:', error);
				throw error;
			}
		},
		destroy: function (connection) {
			return connection.end();
		},
	},
	{
		max: 200, // Maximum number of connections
		min: 2, // Minimum number of connections
		idleTimeoutMillis: 30000, // 30 seconds idle timeout
		acquireTimeoutMillis: 10000, // Wait up to 10 seconds for a connection
	},
);

// Function to keep the connection alive
async function keepAlive() {
	try {
		const connection = await pool.acquire();
		await connection.execute('SELECT 1'); // Simple query to keep alive
		await pool.release(connection);
		log.info('Connection keep-alive successful.');
	} catch (error) {
		log.error('Keep-alive failed:', error);
	}
}

// Function to check the connection with retry mechanism
async function checkConnection() {
	let connection;
	try {
		connection = await pool.acquire();
		const [rows] = await connection.execute('SELECT 1');
		log.info('Database connection successful:', rows);
	} catch (error) {
		log.error('Database connection failed:', error);
	} finally {
		if (connection) {
			await pool.release(connection);
		}
	}
}

setInterval(keepAlive, 5 * 60 * 1000);
// Example of checking the connection
checkConnection();

module.exports = pool;
