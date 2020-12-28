let elementTextField = document.querySelector('.autocomplete');
const output = document.querySelector('#output');
const outputBtn = document.getElementById('outputBtn'); 
const warning = document.getElementById('warning');
const label = document.getElementById('label');
var elems = document.querySelectorAll('.autocomplete');
const tagsRow = document.getElementById('tags-row'); 
const tagsSection = document.getElementById('tags-section'); 

const url = window.location.href;  

loadAllEventListeners(); 
function loadAllEventListeners(){
    document.addEventListener('DOMContentLoaded', starter);
    outputBtn.addEventListener('click', function(e){
        e.preventDefault(); 
        if(location.href.endsWith('/search') || location.href.includes('general')){
            generalFoodButtonAction(); 
            
        }else{
            ingredientsButtonAction(); 
        }
    }); 
}



  async function starter(){
    let foods = await getFoods();
    const foodList = getProperFoodFormat(foods.data); 
    const ingredients = getProperIngredientFormat(foods.data);
    if(window.location.href.endsWith('search') || window.location.href.includes('general')){
        var instances = M.Autocomplete.init(elems, {
            data: foodList,
        });
        label.innerHTML = 'Food name'; 

    }else if(url.includes('ingredients')){
        var instances = M.Autocomplete.init(elems, {
            data: ingredients,
        });

        label.innerHTML = 'Ingredient name';
    }
  }

  async function generalFoodButtonAction(){
    if(elementTextField.value == ''){
        throwError('Please enter an ingredient');  
    }else{
        warning.innerHTML = '';
        let similarFoods = await searchItem('foods', elementTextField.value); 
        if(similarFoods){
            newTag(elementTextField.value); 
            console.log(similarFoods);
        }
    }
}

async function ingredientsButtonAction(){
    if(elementTextField.value == ''){
        throwError('Please enter an ingredient');  
    }else{
        warning.innerHTML = '';
        let similarFoods = await searchItem('ingredients', elementTextField.value); 
        if(similarFoods){
            addTag(elementTextField.value); 
            console.log(similarFoods);
        }
    }
}

  async function getFoods(){
    const response = await fetch(`${root}/api/foods`); 
    const resData = await response.json(); 
    if(!resData){
        console.log('sorry, something went wrong'); 
    }
    return resData; 
}


function getProperFoodFormat(foodListRows){
    let foodList = {}
    for(let i = 0; i<foodListRows.length; i++){
        foodList[`${foodListRows[i].name}`] = null; 
    }
    return foodList; 
}

function getProperIngredientFormat(foodListRows){
    let ingredientsList = {}; 
    let ingredients = []; 
    for(let i=0; i<foodListRows.length; i++){
        ingredients = ingredients.concat(foodListRows[i].ingredients);
    }
    for(let i=0; i<ingredients.length; i++){
        ingredientsList[`${ingredients[i]}`]=null; 
    }
    return ingredientsList; 
}


async function searchItem(stream, name){
    const response = await fetch(`${root}/api/${stream}/${name}`); 
    const resData = await response.json(); 
    if(!resData || resData.success === false){
        if(stream === 'foods'){
            throwError(`Sorry, we could not find food named ${name}`);
        }else{
            throwError(`Sorry, we could not find foods with ${name}`);
        }
        return false; 
    }else{
        return resData.data; 
    }
    return resData; 
}

tagsRow.addEventListener('click', function(e){
    e.preventDefault(); 
    if(e.target.parentElement.classList.contains('delete-item')){
        e.target.parentElement.parentElement.remove(); 
    } 
});

function addTag(value){
    const span = document.createElement('span'); 
    span.className = 'btn-small'; 
    span.style = 'margin-right: 10px;';
    span.appendChild(document.createTextNode(value)); 
    if(window.location.href.endsWith('search') || window.location.href.includes('general')){
        span.id = 'tag'; 
    }
    const link = document.createElement('a'); 
    link.className = 'delete-item secondary-content'; 
    
    link.innerHTML = '<i style="padding-right:2px;" class = "white-text center-align material-icons">close</i>'; 

    span.appendChild(link); 
    tagsRow.appendChild(span); 
}

function newTag(value){

    if(document.querySelectorAll('tag') !== null){
        document.getElementById('tag').remove(); 
        addTag(value);
    }else{
        addTag(value); 
    }
}

function throwError(message){
    warning.innerHTML = message; 
    warning.color = 'red'; 
}