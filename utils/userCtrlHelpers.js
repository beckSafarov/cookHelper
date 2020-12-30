const Foods = require('../modules/foods'),
    asyncHandler = require('../middleware/async')


exports.searchFoodByIngredient = asyncHandler(async(ingredients)=>{
    const allFoods = await Foods.find().exec(); 
    let foodList = [];
    ingredients.forEach(function(ingredient){
      allFoods.forEach(function(food){
         food.ingredients.forEach(function(foodIngredient){
           if(foodIngredient === ingredient || foodIngredient.includes(ingredient)){
              foodList.push(food); 
           }
         })//end of looping ingredients array in food
      })//end of looping all foods 
    })//end of looping ingredients 
 
     return (foodList.length === 0 ? false : foodList);
 })
 
 exports.searchFoods = asyncHandler(async(searchedFood)=>{
   const allFoods = await Foods.find().exec(); 
   let foodList = []; 
   allFoods.forEach(function(food){
     if(food.name === searchedFood || food.name.includes(searchedFood)){
        foodList.push(food); 
     }
   })//end of the all foods loop 
   return (foodList.length === 0 ? false:foodList); 
 })

exports.getQueriedIngredients = (url)=>{
  let queries; 
  let queriesList = []; 
  if(url.includes('names')){
      queries = url.split('=')[1];
      if(queries.includes(';')){
          queriesList.concat(queries.split(';')); 
      }else{
          queriesList.push(queries); 
      }
  }
  (queriesList.length === 0) ? false:queriesList;
}