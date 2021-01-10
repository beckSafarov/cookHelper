const path = require('path'),
    User = require('../modules/user'),
    Foods = require('../modules/foods'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'),
    {
      searchFoodByIngredient,
      searchFoods,
      getUniqueArray,
      getRandomFoods
    } = require('../utils/userCtrlHelpers');

//@desc      create/sign-up a new user, 
//@route     POST /auth/signup 
//@access    Public
exports.createNewUser = asyncHandler(async(req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: newUser,
    });
  });
  
  //@desc      create multiple users for development
  //@route     POST /auth/signmultiple
  //@access    Private
  exports.createMultipleUsers = asyncHandler(async(req, res, next) => {
    const newUsers = req.body;
    newUsers.forEach(async function(user){
      await User.create(user); 
    });
  
    res.status(201).json({
      success: true,
      msg: `${newUsers.length} new users have been successfully created`,
    });
  });
  
  
  
  //@desc      login
  //@route     POST /auth/login
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
      
      //res.json({ success: true, msg: 'Good job, you are in' });
      sendTokenResponse(user, 200, res);
  
   });

  //@desc      delete a user
  //@route     DELETE /auth/delete/:id
  //@access    Private
  exports.deleteUser = asyncHandler(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
      return next(new ErrorResponse('Invalid id', 404)); 
    }
    
    res.status(201).json({
      success: true,
      msg: `User has been successfully deleted`,
    });
  });

  //@desc      flush user model
  //@route     DELETE /auth/delete
  //@access    Private
  exports.deleteAll = asyncHandler(async(req, res, next) => {
    await User.deleteMany(); 
    
    res.status(201).json({
      success: true,
      msg: `User model has been emptied`,
    });
  });

  //@desc      logout user
  //@route     GET /auth/logout
  //@access    Private
  exports.logout = asyncHandler(async(req, res, next)=>{
   res.clearCookie('token');

    res.status(200).json({
      success: true,
      msg: 'The user has been successfully logged out'
    })
  })

  //@desc      get the currently logged in user
  //@route     GET /auth/currentuser
  //@access    Private
  exports.getCurrentUser = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user.id); 
      res.status(200).json({
        success: true, 
        data: user
      })
  })

    //get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken(),
      options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
      id: user._id
    });
  };