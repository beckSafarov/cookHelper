const Foods = require('../modules/foods'),
    User = require('../modules/user'),
    asyncHandler = require('../middleware/async')



 
 exports.searchFoods = asyncHandler(async(searchedFood)=>{
   const allFoods = await Foods.find().exec(); 
   let foodList = []; 
   allFoods.forEach(function(food){
     if(food.name === searchedFood || food.name.includes(searchedFood)){
        foodList.push(food); 
        allFoods.splice(allFoods.indexOf(food), 1); 
     }
   })//end of the all foods loop 
   return (foodList.length === 0 ? false:foodList); 
 })


exports.getUniqueArray = (a) =>{
  let item; 
  let seen = {}; 
  let out = []; 
  let j = 0; 
  for(let i = 0; i<a.length; i++){
    item = a[i]; 
    if(!seen[item]){
      seen[item] = 1; 
      out[j++] = item; 
    }
  }

  return out; 
}

exports.getUniqueObjectArray = (a) => {
  
  let jammedList = [];  
  let out = []; 
  a.forEach(function(element){
      jammedList.push(`${element.numericalDifficulty}_${element.category}`); 
  }); 
  jammedList = this.getUniqueArray(jammedList); 
  jammedList.forEach(function(element){
      out.push({
        numericalDifficulty: parseInt(element.split('_')[0]),
        category: element.split('_')[1],
      })
  });

  return out; 
}


exports.getRandomFoods = (allSimilarFoods)=>{
  let similarFoods = []; 
  let random; 
  for(let i = 0; i<4; i++){
    random = Math.floor(Math.random() * allSimilarFoods.length) + 1; 
    similarFoods[i] = allSimilarFoods[random];  
  }
  return similarFoods; 
}

exports.checkLike = asyncHandler(async(favorites, foodId)=>{
  let status = false; 
  for(let i = 0; i<favorites.length; i++){
    if(favorites[i] == foodId){
        status = true; 
    }
  }//end of the for loop 

  return status; 
});

exports.refineIngredientsQuery = function(ingredients){
  let ingredientsArray = []; 
  if(ingredients.includes(' ')){
    ingredientsArray = ingredients.split(' '); 
    for(let i = 0; i<ingredientsArray.length; i++){
      if(ingredientsArray[i].includes('-')){
        ingredientsArray[i] = ingredientsArray[i].split('-').join(' '); 
      }

    }//end of the for loop  
  }else{
    if(ingredients.includes('-')){
      ingredientsArray.push(ingredients.split('-').join(' ')); 
    }else{
      ingredientsArray.push(ingredients);
    }
  }//end of the else statement
  return ingredientsArray; 
}



