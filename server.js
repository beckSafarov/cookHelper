const express = require('express'),
  path = require('path'),
  dotenv = require('dotenv'),
  app = express(),
  morgan =require('morgan'),
  colors = require('colors'),
  errorHandler = require('./middleware/error'),
  fileupload = require('express-fileupload'),
  xss = require('xss-clean'),
  helmet = require('helmet'),
  mongoSanitize = require('express-mongo-sanitize');
 

//load env vars
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
//Body parser
app.use(express.json());

//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//the next set of declarations 
const userRoutes = require('./routes/userRoutes'),
  pageRoutes = require('./routes/pageRoutes'),
  apiRoutes = require('./routes/apiRoutes'),
  authRoutes = require('./routes/authRoutes'),
  connectDB = require('./config/db'); //connecting the database

connectDB(); 

//file upload
app.use(fileupload());

//use mongo sanitize to sanitize the incoming code injections
app.use(mongoSanitize());

//set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

//prevent XSS attacks
app.use(xss());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


//mounting routes 
app.use('/', pageRoutes); 
app.use('/user', userRoutes); 
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler); //using errorhandler function in case of errors 


var server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('unhandledRejection', err.message);
  //close server & exit process
  server.close();
});

//handling crashes
process.on('uncaughtException', (err, promise) => {
  console.log('uncaughtException', err.message);
  //close server & exit process
  server.close();
});

//killing server
process.on('SIGTERM', (err, promise) => {
  console.log('SIGTERM', err.message);
  //close server & exit process
  server.close();
});
