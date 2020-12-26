let elementTextField = document.querySelector('.autocomplete');
const output = document.querySelector('#output');
const outputBtn = document.getElementById('outputBtn'); 
const warning = document.getElementById('warning');
const label = document.getElementById('label');
var elems = document.querySelectorAll('.autocomplete');
const tagsRow = document.getElementById('tags-row'); 
const url = window.location.href;  
    

document.addEventListener('DOMContentLoaded', async function() {
    const foods = await getFoods(); 
    const foodList = getProperFoodFormat(foods.data); 
    const ingredients = getProperIngredientFormat(foods.data);
    
    if(url.endsWith('search') || url.includes('general')){
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
});


  async function getFoods(){
    const response = await fetch('http://localhost:5000/api/foods'); 
    const resData = await response.json(); 
    if(!resData){
        console.log('sorry, something went wrong'); 
    }
    return resData; 
}

function getProperFoodFormat(foods){
    let foodList = {}
    for(let i = 0; i<foods.length; i++){
        foodList[`${foods[i].name}`] = null; 
    }
    return foodList; 
}

function getProperIngredientFormat(foods){
    let ingredientsList = {}; 
    let ingredients = []; 
    for(let i=0; i<foods.length; i++){
        ingredients = ingredients.concat(foods[i].ingredients);
    }
    for(let i=0; i<ingredients.length; i++){
        ingredientsList[`${ingredients[i]}`]=null; 
    }
    return ingredientsList; 
}

outputBtn.addEventListener('click', function(e){
    e.preventDefault(); 
    if(elementTextField.value == ''){
        warning.innerHTML = 'Please enter an ingredient'; 
        warning.style.color = 'red'; 
    }else{
        warning.innerHTML = '';
        createTag(elementTextField.value); 
    }
});

tagsRow.addEventListener('click', function(e){
    e.preventDefault(); 
    if(e.target.parentElement.classList.contains('delete-item')){
        e.target.parentElement.parentElement.remove(); 
    } 
});

function createTag(value){
    const span = document.createElement('span'); 
    span.className = 'btn-small'; 
    span.style = 'margin-right: 10px;';
    span.appendChild(document.createTextNode(value)); 
    const link = document.createElement('a'); 
    link.className = 'delete-item secondary-content'; 
    link.innerHTML = '<i style="padding-right:2px;" class = "white-text center-align material-icons">close</i>'; 
    span.appendChild(link); 
    tagsRow.appendChild(span); 
}
