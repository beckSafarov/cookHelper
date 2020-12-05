const path = require('path'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse');

//@desc      Open the home page
//@route     GET /
//@access    Public
exports.indexPage = asyncHandler(async(req, res, next) => {
    res.render('index'); 
  });

//@desc      Sign up page
//@route     GET /signup 
//@access    Public
exports.signUpPage = asyncHandler(async(req, res, next) => {
    res.render('signup'); 
  });