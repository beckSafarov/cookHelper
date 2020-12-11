const express = require('express'),
  path = require('path'),
  dotenv = require('dotenv'),
  app = express(),
  morgan =require('morgan'),
  colors = require('colors'),
  errorHandler = require('./middleware/error'),
  PORT = process.env.PORT || 5000;



//load env vars
dotenv.config({ path: './config/config.env' });
app.set('view engine', 'ejs');
//Body parser
app.use(express.json());


//the next set of declarations 
const userRoutes = require('./routes/userRoutes'),
  pageRoutes = require('./routes/pageRoutes'),
  connectDB = require('./config/db'); //connecting the database

connectDB(); 

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pageRoutes); 
app.use('/user', userRoutes); 
app.use(errorHandler); //using errorhandler function in case of errors 



//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);