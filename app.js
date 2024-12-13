// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const app = express();
const server = require('http').createServer(app);
require('dotenv').config(); // Load environment variables from .env file

// Configure logging
var log4js = require('log4js');
var log = log4js.getLogger('app'); // Logger for general application logs
const errorLog = log4js.getLogger('error'); // Logger for error logs
log4js.configure('./log.json'); // Configure log4js using log.json settings

// Enable Cross-Origin Resource Sharing (CORS)
const corsOptions = {
	origin: (origin, callback) => {
		const whitelist = ['http://localhost:3000', 'https://ayursahya.com']; // Allowed origins
		if (!origin || whitelist.includes(origin)) {
			// Allow requests with no origin (e.g., server-to-server) or from whitelisted domains
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS')); // Reject other origins
		}
	},
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allowed HTTP methods
	allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
	exposedHeaders: ['Content-Length', 'X-Requested-With'], // Headers exposed to the client
	credentials: true, // Allow cookies and credentials
	optionsSuccessStatus: 204, // Status for successful preflight response
};
//app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname + '/public')));
// Set the default views directory to html folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions)); // Use CORS with specified options

// Apply the CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '/public')));

// Set the views directory and the view engine
app.set('views', path.join(__dirname, 'views')); // Directory for views
app.set('view engine', 'ejs'); // Set EJS as the template engine

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Import route modules
const indexRouter = require('./routes/indexRoutes');
// Use imported route modules
app.use('/', indexRouter);
// Start the server and listen on the specified port
const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000
server.listen(PORT, () => {
	log.info(`Server running on port ${PORT}`); // Log server start information
});
