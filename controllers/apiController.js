const path = require('path'),
    Users = require('../modules/user'),
    Foods = require('../modules/foods'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'),
    {getUniqueArray} = require('../utils/userCtrlHelpers');



//@desc      get the foods
//@route     GET /api/foods
//@access    Private
exports.foods = asyncHandler(async(req, res, next) => {
    //find all food data
    const foods = await Foods.find(); 
    res.json({
        success: true,
        data: foods,
    })
  });

  //@desc      search for some food
  //@route     GET /api/foods/:food
  //@access    Private
  exports.searchFood = asyncHandler(async(req, res, next) => {
    let similarFoodList = []; 
    const allFoods = await Foods.find().exec(); 
    for(let i = 0; i<allFoods.length; i++){
        if(allFoods[i].name.includes(req.params.food)){
            similarFoodList.push(allFoods[i]); 
        }
    }

    if(similarFoodList.length == 0){
        res.json({
            success: false,
            error: `${req.params.food} is not found`
        })
    }else{
        console.log(req.headers.cookie);
        res.json({
            success: true,
            data: similarFoodList
         })
    }
  }); //end of search food 

  //@desc      search for some food
  //@route     GET /api/ingredients/:ingredient
  //@access    Private
  exports.searchFoodByIngredient = asyncHandler(async(req, res, next)=>{
    const allFoods = await Foods.find().exec(); 
    const foodList = [];
    for(let i = 0; i<allFoods.length; i++){
        for(let x= 0; x<allFoods[i].ingredients.length; x++){
            if(req.params.ingredient === allFoods[i].ingredients[x]){
                foodList.push(allFoods[i]); 
            }
        } //end of the second loop 
    }//end of the first loop 
    if(foodList.length === 0){
        res.json({
            success: false,
            error: `Food with ingredient ${req.params.food} not found `
        })
    }else{
        res.json({
            success: true,
            data: foodList
        })
    }
  });

//@desc      get the users
//@route     GET /api/:specialpass/users
//@access    Private
exports.users = asyncHandler(async(req, res, next) => {
    if(req.params.specialpass != process.env.IDENTITY_PASS){
        res.status(400).json({
            success: false,
            msg: 'You have no right to access user data'
        })
    }else{
        //find all food data
        const users = await Users.find(); 
        res.json({
            success: true,
            data: users
    })
    }
    
  });


//@desc      get recommended foods for a user
//@route     GET /api/:specialpass/recommended
//@access    Private
exports.recommended = asyncHandler(async(req, res, next)=>{
    let foodNames = []; 
    if(req.params.specialpass !== process.env.IDENTITY_PASS){
        return next(new ErrorResponse('Invalid access token', 404))
    };

    const user = await Users.findById(req.body.id); 
    if(!user){
        return next(new ErrorResponse('Invalid user id', 404))
    }

    res.status(200).json({
        success: true,
        data: user.recommended
    })
})


//@desc      get likes of a food
//@route     GET /api/foods/:foodId/likes
//@access    Private
exports.getLikes = asyncHandler(async(req, res, next)=>{
    const food = await Foods.findById(req.params.foodId); 
    if(!food){
        return next(new ErrorResponse(`No such food found`, 404)); 
    }
    // console.log(food);
    res.status(200).json({
        success: true,
        data: food.likes
    })
})