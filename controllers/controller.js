const path = require('path'),
    User = require('../modules/user'),
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

//@desc      create/sign-up a new user, 
//@route     POST /signup 
//@access    Public
exports.createNewUser = asyncHandler(async(req, res, next) => {
  const newUser = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

//@desc      login
//@route     POST /login
//@access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //validate email and password fields
    if (!email || !password) {
      return next(new ErrorResponse(`Please provide an email and password`, 400));
    }

    //check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse(`Such user does not exist`, 401));
    }

    //check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse(`Password is wrong`, 401));
    }
    
    res.json({ success: true, msg: 'Good job, you are in' });


 });
 
