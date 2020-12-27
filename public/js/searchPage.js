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
    document.addEventListener('DOMContentLoaded', main);
    outputBtn.addEventListener('click', buttonAction); 
}



  async function main(){
    let foods = await getFoods();
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
  }

  async function getFoods(){
    const response = await fetch(`${root}/api/foods`); 
    const resData = await response.json(); 
    if(!resData){
        console.log('sorry, something went wrong'); 
    }
    return resData; 
}

async function post(url, data){
        
    const response = await fetch(url, {
             method: 'POST',
             headers: {
                 'Content-type':'application/json'
             },
             body: JSON.stringify(data)
     }); 
     const resData = await response.json(); 
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



async function buttonAction(e){
    e.preventDefault(); 
    if(elementTextField.value == ''){
        warning.innerHTML = 'Please enter an ingredient'; 
        warning.style.color = 'red'; 
    }else{
        warning.innerHTML = '';
        let foodConfirmed = await confirmFood(elementTextField.value); 
        if(foodConfirmed){
            createTag(elementTextField.value); 
            searchFood(elementTextField.value); 
        }else{
            warning.innerHTML = `Sorry! Food named ${elementTextField.value} not found`;
            warning.color = 'red'; 
        }
        
    }
}

async function confirmFood(foodName){
    const foodResponse = await getFoods(); 
    for(let i = 0; i<foodResponse.data.length; i++){
        if(foodResponse.data[i].name === foodName){
            return true;  
        }
    }
    return false; 
}


async function searchFood(foodName){
    // let foodList = []; 
    // let foodFound = false; 
    // const foodResponse = await getFoods(); 
    // for(let i = 0; i<foodResponse.data.length; i++){
    //     if(foodResponse.data[i].name.includes(foodName)){
    //         foodList.push(foods[i]); 
    //         foodFound = true; 
    //     }
    // }
    const sendData = {
        food: foodName
    }

    post(`${root}/api/loadsomefoods`, sendData)
    .then(data => console.log(data))
    .catch(err => console.log(err));

    // return (!foodFound) ? false:foodList;
}

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
