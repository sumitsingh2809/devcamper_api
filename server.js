const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load ENV Vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const auth = require('./routes/auth');

// Logger File
const logger = require('./middleware/logger');

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File Uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent XSS attack
app.use(xss());

// Rate Limiting
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    })
);

// Prevent HTTP param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //   close server and exit process
    server.close(() => process.exit(1));
});
