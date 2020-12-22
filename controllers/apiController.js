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

