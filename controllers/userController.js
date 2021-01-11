const path = require('path'),
    User = require('../modeles/user'),
    Foods = require('../modeles/foods'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'),
    {
      searchFoods,
      getUniqueArray,
      getUniqueObjectArray,
      getRandomFoods,
      checkLike,
      foodVisited,
      refineIngredientsQuery
    } = require('../utils/userCtrlHelpers'); 
const { recommended } = require('./apiController');



//@desc      dashboard page
//@route     GET /user/dashboard
//@access    Private
 exports.dashboard = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  // console.log(user); 
  let tab = '$'; 
  let sideTab = '$'; 
  let foods = []; 
  let recs; 
  if(!user){
      return next(new ErrorResponse(`Such user not found`, 404));
  }
  
  if(!req.query.category || req.query.category == 'recfoods'){
    for(let i = 0; i<user.recommended.length; i++){
      if(user.recommended[i].category !== "undefined"){
        recs = await Foods.find({numericalDifficulty: {$lte: user.recommended[i].numericalDifficulty}, category: user.recommended[i].category});
        // console.log('1'); 
        // console.log(recs); 
      }else{
        recs = await Foods.find({numericalDifficulty: {$lte: user.recommended[i].numericalDifficulty}}); 
        // console.log('2'); 
      } 
      foods = foods.concat(recs);
    }
    foods = getUniqueArray(foods); 
    // console.log(foods);
    tab = `recfoods`;
    sideTab = `${tab}Side`;
  }else{
    foods = await Foods.find({category: req.query.category}).exec(); 
    tab = `${req.query.category}`;
    sideTab = `${tab}Side`; 
    if(!foods){
        return next(new ErrorResponse(`${req.query.category} is wrong query`, 404));
    }
  }

  res.render('dashboard', {
    foods,
    root: process.env.root,
    tab,
    sideTab
  });

 })

 
//@desc      Search Food page
//@route     GET /user/search
//@access    Private
 exports.searchPage = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  let foodList = []; 
  
  if(req.query.name){
    foodList = await searchFoods(req.query.name); 
    if(!foodList){
      res.status(400).json({
        success: false,
        error: `No food named ${req.query.ingredient} was found`
      })
    }
  }//end of the if statement
  res.render('generalSearch', {
    root: process.env.root,
    foods: foodList,
    enteredFood: req.query.name
  }); 
 })

//@desc      Search Ingredients page
//@route     GET /user/search/ingredients 
//@queries   GET /user/search/ingredients?ingredients=sausage+bread
//@access    Private
exports.ingredients = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  let foodList = []; 
  let ingredientsArray = [];
  let result;
  let message = `No Text Here`; 
  let success = true; 
  if(req.query.ingredients){
    ingredientsArray = refineIngredientsQuery(req.query.ingredients); 
    result = await searchIngredients(ingredientsArray); 
    success = result.success; 
    message = result.message; 
    foodList = result.data; 
 
  }

  res.render('searchIngredients', {
    success,
    message,
    root: process.env.root,
    foods: foodList,
    ingredients: ingredientsArray,
    lastEntered: ingredientsArray[ingredientsArray.length-1]
  })
  
});//end of the ingredients controller 

const searchIngredients = async function(ingredientsList){
  let success = false; 
  let data = []; 
  let message = `No food found with the provided ingredients`; 
  const food = await Foods.find({ingredients: {$all: ingredientsList}}); 
  if(food.length > 0){
    success = true; 
    message = `${food.length} food(s) found containing the provided ingredients`; 
    data = food; 
  }

  return {
    success, 
    message,
    data
  }
}



//@desc      Chosen Food Page
//@route     GET /user/food/:foodId
//@access    Private
exports.foodPage = asyncHandler(async(req, res, next)=>{
  const food = await Foods.findById(req.params.foodId); 
  let user = await User.findById(req.user.id); 
  let likeStatus = false; 
  if(!food){
    return next(new ErrorResponse(`No food was found with the id of ${req.params.id}`, 400));
  }
  const allSimilarFoods = await Foods.find({category: food.category})
  // const similarFoods = getRandomFoods(allSimilarFoods); 
  allSimilarFoods.forEach(function(currentFood, index){
     if(currentFood.id === req.params.foodId){
       allSimilarFoods.splice(index, 1); 
     }
  }); 
  likeStatus = await checkLike(user.favorites, req.params.foodId); 
  user = user.foodVisited(food);
  await User.findByIdAndUpdate(user.id, user); 
  res.render('foodPage', {
    root: process.env.root,
    food: food,
    similarFoods: allSimilarFoods,
    likeStatus: likeStatus
  }); 
});


//@desc      Like a food
//@route     PUT /user/food/:foodId/liked
//@access    Private
exports.foodLikedController = asyncHandler(async(req, res, next)=>{
  const food = await Foods.findById(req.params.foodId);
  const user = await User.findById(req.user.id);  
  if(!food){
    return next(new ErrorResponse(`Could not find such food`, 404)); 
  }
  const foodLikedBefore = await checkLike(user.favorites, food.id);
  if(foodLikedBefore){
    return next(new ErrorResponse(`${food.name} is already liked by ${user.name}`, 404));
  }

  food.addLike(); 
  const newRecommended = user.foodLiked(food); 
  user.save(); 
  food.save();
  res.status(200).json({
    success: true,
    msg: `${food.name} is liked by ${user.name}`,
    data: newRecommended
    
  })
})

//@desc      Unlike a food
//@route     PUT /user/food/:foodId/unliked
//@access    Private
exports.foodUnlikedController = asyncHandler(async(req, res, next)=>{
  const food = await Foods.findById(req.params.foodId);
  const user = await User.findById(req.user.id);  
  if(!food){
    return next(new ErrorResponse(`Could not find such food`, 404)); 
  }
  const foodLikedBefore = await checkLike(user.favorites, food.id); 
  if(!foodLikedBefore){
    return next(new ErrorResponse(`${food.name} is not liked by ${user.name}`, 404));
  }
  food.removeLike(); 
  const newFavorites = user.foodUnliked(req.params.foodId);  
  user.save(); 
  food.save(); 
  res.status(200).json({
    success: true,
    msg: `${food.name} is unliked by ${user.name}`,
    data: newFavorites
    
  })
})

//@desc      Check food like
//@route     GET /user/food/shoppinglist
//@access    Private
exports.shoppingListPage = asyncHandler(async(req, res, next)=>{
  const userData = await User.findById(req.user.id);
  let title;  
  if(userData.ingredients.length < 1){
      title = 'Your shopping list is empty'; 
  }else{
      title = 'Your shopping list'; 
  }
  res.render('shopping', {
    root: process.env.root,
    ingredients: userData.ingredients,
    info: title
  });  
});

//@desc      add foods to the shopping list
//@route     GET /user/shoppinglist/add
//@access    Private
exports.addToShoppingList = asyncHandler(async(req, res, next)=>{
  const foodId = req.body.id; 
  let listObj = []; 
  if(!foodId){
    return next(new ErrorResponse(`Please provide the id of the food`, 400));
  }
  const food = await Foods.findById(foodId); 
  const user = await User.findById(req.user.id); 
  food.ingredients.forEach(function(ingredient){
      listObj.push({ingredient, food: food.name}); 
  });
  const currentIngredients = user.addToIngredients(listObj); 
  user.save(); 

  res.status(200).json({
      success: true, 
      added: food.ingredients,
      current: currentIngredients
  })
});

//@desc      remove one food from the shopping list
//@route     GET /user/shoppinglist/remove
//@access    Private
exports.removeFromShoppingList = asyncHandler(async(req, res, next)=>{
  const {ingredientName, foodName} = req.body; 
  if(!ingredientName || !foodName){
    return next(new ErrorResponse(`Ingredient name and food name required`, 400));
  }
  const user = await User.findById(req.user.id); 
  const currentList = user.removeFromIngredients(ingredientName, foodName); 
  user.save(); 
  res.status(200).json({
    success: true, 
    removed: `${ingredientName} for ${foodName}`,
    current: currentList
  })
});

//@desc      clean the shopping list
//@route     GET /user/shoppinglist/flush
//@access    Private
exports.flushShoppingList = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id); 
  const currentList = user.flushIngredients(); 
  user.save(); 
  res.status(200).json({
    success: true, 
    removed: `All ingredients`,
    current: currentList
  })
});

//@desc      favorite foods page
//@route     GET /user/favorites
//@access    Private
exports.favorites = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  let message = 'You have not liked any food yet'; 
  let foods = []; 
  let food; 
  if(user.favorites.length > 0){
    for(let i = 0; i<user.favorites.length; i++){
      food = await Foods.findById(user.favorites[i]); 
      foods.push(food); 
    }
    
    message = 'Your favorite foods'
  }
  // console.log(foods);
  res.render('favorites', {
    root: process.env.root,
    foods: foods,
    message
  })
});