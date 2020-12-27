const path = require('path'),
    Users = require('../modules/user'),
    Foods = require('../modules/foods'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse');


//@desc      get the foods
//@route     GET /api/foods
//@access    Private
exports.foods = asyncHandler(async(req, res, next) => {
    //find all food data
    const foods = await Foods.find(); 
    res.json({
        success: true,
        data: foods
    })
  });

//@desc      get the
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

//@desc      get some foods
//@route     POST /api/loadsomefoods
//@access    Private
exports.loadSomeFoods = asyncHandler(async(req, res, next)=>{
    const requiredFoodName = req.body.food; 
    if(!requiredFoodName){
        res.status(400).json({
            success: false, 
            error: 'Empty or wrong query data',
            you_sent: req.body.foodList
        })
    }else if(requiredFoodName.length === 0){
        res.status(400).json({
            success: false, 
            error: 'You sent an empty array',
            you_sent: req.body.foodList
        })
    }

    else{
        let allFoods = await Foods.find().exec(); 
        let foodList = []; 

        for(let i = 0; i<allFoods.length; i++){
            if(allFoods[i].name.includes(requiredFoodName)){
                foodList.push(allFoods[i]); 
            }
        }
        res.status(200).json({
            success: true,
            foodList,
            you_sent: req.body.foodList
        })
    }

    
})