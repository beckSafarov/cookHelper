const express = require('express'),
  dotenv = require('dotenv'),
  app = express(),
  morgan =require('morgan'),
  colors = require('colors'),
  PORT = process.env.PORT || 5000;



//load env vars
dotenv.config({ path: './config/config.env' });
app.set('view engine', 'ejs');


//the next set of declarations 
const routes = require('./routes/routes'),
  connectDB = require('./config/db'); //connecting the database

connectDB();
app.use(express.json()); //body parser 
app.use('/', routes); 



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