const path = require('path'),
    User = require('../modules/user'),
    Foods = require('../modules/foods'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'),
    {
      searchFoodByIngredient,
      searchFoods,
      getQueriedIngredients
    } = require('../utils/userCtrlHelpers'); 



//@desc      create/sign-up a new user, 
//@route     POST /user/signup 
//@access    Public
exports.createNewUser = asyncHandler(async(req, res, next) => {
  const newUser = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

//@desc      login
//@route     POST /user/login
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

//@desc      dashboard page
//@route     GET /user/dashboard
//@access    Private
 exports.dashboard = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  if(!user){
      return next(new ErrorResponse(`Such user not found`, 404));
  }

  if(!req.query.category || req.query.category == 'recfoods'){
    const featuredFoods = await user.featuredFoods();
    res.render('dashboard', {
      foods: featuredFoods,
      root: process.env.root
    });
  }else if(req.query.category == 'fastfoods'){
    const fastfoods = await Foods.find({category: 'fast-food'}).exec(); 
    res.render('dashboard', {
      foods: fastfoods,
      root: process.env.root
    });
  }else if(req.query.category == 'meatcorner'){
    const meaty = await Foods.find({category: 'meaty'}).exec(); 
    res.render('dashboard', {
      foods: meaty,
      root: process.env.root
    });
  }else if(req.query.category == 'lowfat'){
    const lowfat = await Foods.find({category: 'low-fat'}).exec(); 
    res.render('dashboard', {
      foods: lowfat,
      root: process.env.root
    });
  }else{
    return next(new ErrorResponse(`${req.query.category} is wrong query`, 404));
  }
 })

//@desc      Search Food page
//@route     GET /user/search
//@access    Private
 exports.searchPage = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  let foodList = []; 
  let message = ``;
  
  if(req.query.name){
    foodList = await searchFoods(req.query.name); 
    if(!foodList){
      res.status(400).json({
        success: false,
        error: `No food named ${req.query.ingredient} was found`
      })
    }
    message = `Search Result(s) for ${req.query.name}`;
  }//end of the if statement
  res.render('generalSearch', {
    root: process.env.root,
    foods: foodList,
    message: message
  }); 
 })

//@desc      Search Ingredients page
//@route     GET /user/search/ingredients 
//@queries   GET /user/search/ingredients?name=sausage;bread
//@access    Private
exports.ingredients = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  let foodList = []; 
  let ingredientsArray = [];
  ingredientsArray.push(req.query.name); 
  if(req.query.name){
    if(req.query.name.includes(';')){
      ingredientsArray = req.query.name.split(';');
    } 
    foodList = await searchFoodByIngredient(ingredientsArray)
  }else{
    ingredientsArray = []; 
  }
  console.log(ingredientsArray);

  res.render('searchIngredients', {
    root: process.env.root,
    foods: foodList,
    ingredients: ingredientsArray
  })
  
});//end of the ingredients controller 

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
