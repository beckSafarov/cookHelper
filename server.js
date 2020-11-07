const express = require('express'),
  dotenv = require('dotenv'),
  app = express(),
  routes = require('./routes/routes');
  PORT = process.env.PORT || 5000;


//load env vars
dotenv.config({ path: './config/config.env' });

app.set('view engine', 'ejs');

app.use('/', routes); 

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);