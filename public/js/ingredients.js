let elementTextField = document.querySelector('.autocomplete');
let clearBtn = document.getElementById('clearBtn');
const output = document.querySelector('#output');
const outputBtn = document.getElementById('outputBtn'); 
const warning = document.getElementById('warning');
const label = document.getElementById('label');
var elems = document.querySelectorAll('.autocomplete');
const tagsRow = document.getElementById('tags-row'); 
const tagsSection = document.getElementById('tags-section');  
let root = `${location.protocol}//${location.host}`;

const sidenav = document.querySelector('.sidenav'); 
M.Sidenav.init(sidenav, {}); 

loadAllEventListeners(); 

function loadAllEventListeners(){
    document.addEventListener('DOMContentLoaded', starter);
    outputBtn.addEventListener('click', ingredientsButtonAction); 
    clearBtn.addEventListener('click', clearButtonAction); 
    tagsRow.addEventListener('click', function(e){
        e.preventDefault(); 
        removeTag(e); 
     });
}

async function starter(){
    let queryList = []; 
    let foods = await getFoods();
    const ingredients = getProperIngredientFormat(foods.data);

    var instances = M.Autocomplete.init(elems, {
        data: ingredients,
        onAutocomplete: ingredientsButtonAction
    });

    clearButtonToggler(); 
}//end of the starter function 

async function ingredientsButtonAction(){
    if(elementTextField.value == ''){
        throwError('Please enter an ingredient');  
    }else{
        warning.innerHTML = '';
        let similarFoods = await searchItem(elementTextField.value); 
        if(similarFoods){
            addTag(elementTextField.value); 
            newIngredientQuery(elementTextField.value); 
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

function addTag(value){
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

function removeTag(e){
    e.preventDefault(); 
    let closeStartingIndex;
    let tagWord; 
    if(e.target.parentElement.classList.contains('delete-item')){
        closeStartingIndex = e.target.parentElement.parentElement.textContent.search('close'); //5:10 
        tagWord = e.target.parentElement.parentElement.textContent.slice(0, closeStartingIndex); 
        e.target.parentElement.parentElement.remove();  
        cutURL(tagWord);
    } 
}

function newIngredientQuery(ingredient){
    let url = window.location.href; 
    if(url.includes('name')){
        window.location.href = `${url};${ingredient}`; 
    }else{
        window.location.href = `${url}?name=${ingredient}`; 
    }
}

function cutURL(tagWord){
    let urlArray = location.href.split('='); 
    let ingredients = urlArray[1]; 
    let ingredientsArray = [];
    if(ingredients.includes(';')){
        ingredientsArray = ingredients.split(';');   
        ingredientsArray.splice(ingredientsArray.indexOf(tagWord), 1); 
        ingredientsArray = ingredientsArray.join(';'); 
        urlArray[1] = ingredientsArray;  
        urlArray = urlArray.join('='); 
        location.href = urlArray; 
    } else{
        location.href = `${root}/user/search/ingredients`; 
    }
}

function clearButtonToggler(){
    if(location.href.includes('name')){
        clearBtn.classList.toggle('disabled'); 
    }
}

function clearButtonAction(){
    location.href = `${root}/user/search/ingredients`;
}



function throwError(message){
    warning.innerHTML = message; 
    warning.style.color = 'red'; 
}