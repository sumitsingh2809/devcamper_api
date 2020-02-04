const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load ENV Vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Logger File
const logger = require('./middleware/logger');

const app = express();

// Body Parser
app.use(express.json());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File Uploading
app.use(fileUpload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

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
