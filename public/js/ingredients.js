let elementTextField = document.querySelector('.autocomplete');
let clearBtn = document.getElementById('clearBtn');
const output = document.querySelector('#output');
const searchBtn = document.getElementById('searchBtn'); 
const warning = document.getElementById('warning');
const label = document.getElementById('label');
var autocompleteElems = document.querySelectorAll('.autocomplete');
const tagsRow = document.getElementById('tags-row'); 
const tagsSection = document.getElementById('tags-section');  
let root = `${location.protocol}//${location.host}`;
let chosenIngredients = []; 

const sidenav = document.querySelector('.sidenav'); 
M.Sidenav.init(sidenav, {}); 

loadAllEventListeners(); 

function loadAllEventListeners(){
    document.addEventListener('DOMContentLoaded', starter);
    searchBtn.addEventListener('click', ingredientsButtonAction); 
    clearBtn.addEventListener('click', clearButtonAction); 
    tagsRow.addEventListener('click', function(e){
        e.preventDefault(); 
        removeQuery(e); 
     });
}

async function starter(){
    let queryList = []; 
    let foods = await getFoods();
    const ingredients = getProperIngredientFormat(foods.data);

    //init autocomplete 
    var instances = M.Autocomplete.init(autocompleteElems, {
        data: ingredients,
        onAutocomplete: addTag
    });

    //init query response
    if(success !== "true" ){
        throwError(message);
    }

    //init clear button toggler
    clearButtonToggler(); 

    //update the content of chosen ingredients
    updateChosenIngredients();
    
     //init drop down
     var dropDownElems = document.querySelectorAll('.dropdown-trigger');
     var instances = M.Dropdown.init(dropDownElems, {
         coverTrigger: false,
         hover: true,
         constrainWidth: false
     });
}//end of the starter function 

async function ingredientsButtonAction(){
    if(chosenIngredients.length === 0){
        throwError('Please enter an ingredient');  
    }else{
        warning.innerHTML = '';
        ingredientsQuery();
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

async function searchItem(name){
    const response = await fetch(`${root}/api/ingredients/${name}`); 
    const resData = await response.json(); 
    if(!resData || resData.success === false){
        throwError(`Sorry, we could not find foods with ${name}`);
        return false; 
    }else{
        return resData.data; 
    }
    return resData; 
}

function addTag(){
    let value = elementTextField.value; 
    elementTextField.value = '';
    const span = document.createElement('span'); 
    span.className = 'btn-small'; 
    span.style = 'margin-right: 10px; border-radius: 25px;';
    span.appendChild(document.createTextNode(value)); 
    const link = document.createElement('a'); 
    link.className = 'delete-item secondary-content'; 
    link.innerHTML = '<i style="padding-right:2px;" class = "white-text center-align material-icons">close</i>'; 

    span.appendChild(link); 
    tagsRow.appendChild(span); 
    chosenIngredients.push(value); 
}

function removeQuery(e){
    e.preventDefault(); 
    let closeStartingIndex;
    let tagWord; 
    if(e.target.parentElement.classList.contains('delete-item')){
        //remove the tag for the query
        closeStartingIndex = e.target.parentElement.parentElement.textContent.search('close'); //5:10 
        tagWord = e.target.parentElement.parentElement.textContent.slice(0, closeStartingIndex); 
        e.target.parentElement.parentElement.remove();  
        //remove the query from list
        for(let i = 0; i<chosenIngredients.length; i++){
            if(tagWord === chosenIngredients[i]){
                chosenIngredients.splice(i, 1); 
            }
        }
    }
}//end of the removeQuery function

function ingredientsQuery(){
    for(let i = 0; i<chosenIngredients.length; i++){
        if(chosenIngredients[i].includes(' ')){
            chosenIngredients[i] = chosenIngredients[i].split(' ').join('-');
        }
    }
    const url = `${root}/user/search/ingredients?ingredients=${chosenIngredients.join('+')}`
    console.log(url);
    window.location.href = url; 
}


function clearButtonToggler(){
    if(location.href.includes('?ingredients')){
        clearBtn.classList.toggle('disabled'); 
    }
}

function clearButtonAction(){
    location.href = `${root}/user/search/ingredients`;
}

function updateChosenIngredients(){
  if(location.href.includes('=')){
    let currentIngredients = location.href.split('='); 
    if(currentIngredients[1].includes('+')){
        currentIngredients = currentIngredients[1].split('+'); 
        for(let i = 0; i<currentIngredients.length; i++){
            if(currentIngredients[i].includes('-')){
                currentIngredients[i] = currentIngredients[i].replace('-', ' ');
            }
        }//end of the for loop 
        chosenIngredients = currentIngredients; 
    }else{
       chosenIngredients.push(currentIngredients[1]); 
    }
  }//end of the first if statement
}//end of the updateCHosenIngredients function


function throwError(message){
    warning.innerHTML = message; 
    warning.style.color = 'red'; 
}