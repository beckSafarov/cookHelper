const path = require('path'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse');

//@desc      Open the home page
//@route     GET /
//@access    Public
exports.indexPage = asyncHandler(async(req, res, next) => {
    res.render('index', {root: process.env.root}); 
  });

//@desc      Sign up page
//@route     GET /signup 
//@access    Public
exports.signUpPage = asyncHandler(async(req, res, next) => {
    res.render('signup', {root: process.env.root}); 
  });

//@desc      Login page
//@route     GET /login 
//@access    Public
exports.loginPage = asyncHandler(async(req, res, next) => {
  res.render('login', {root: process.env.root}); 
});

