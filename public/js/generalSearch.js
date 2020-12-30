let elementTextField = document.querySelector('.autocomplete');
const output = document.querySelector('#output');
const outputBtn = document.getElementById('outputBtn'); 
const warning = document.getElementById('warning');
const label = document.getElementById('label');
var elems = document.querySelectorAll('.autocomplete');
let foodSection = document.getElementById('.foodsection'); 
let root = `${location.protocol}//${location.host}`;

loadAllEventListeners(); 
function loadAllEventListeners(){
    warning.innerHTML = '';
    document.addEventListener('DOMContentLoaded', starter);
    outputBtn.addEventListener('click', generalFoodButtonAction); 
}


async function starter(){
    let foods = await getFoods();
    //fill up the autocomplete field 
    const foodList = getProperFoodFormat(foods.data); 
    var instances = M.Autocomplete.init(elems, {
        data: foodList,
    });

    

}


async function generalFoodButtonAction(){
    let value = elementTextField.value; 
    if(value == ''){
        // throwError('Please enter an ingredient');  
    }else{
        warning.innerHTML = '';
        let similarFoods = await searchItem(value); 
        if(similarFoods){
            newFoodQuery(value);
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


async function searchItem(name){
    const response = await fetch(`${root}/api/foods/${name}`); 
    const resData = await response.json(); 
    if(!resData || resData.success === false){
        throwError(`Sorry, we could not find food named ${name}`);
        return false; 
    }else{
        return resData.data; 
    }
    return resData; 
}

function throwError(message){
    warning.innerHTML = message; 
    warning.style.color = 'red'; 
}

function newFoodQuery(foodName){
    let url = window.location.href; 
    let urlArray = [];
    if(url.includes('name')){
        urlArray = url.split('='); 
        urlArray[1] = foodName; 
        console.log(urlArray); 
        window.location.href = urlArray.join('='); 
    }else{
        location.href = `${location.href}?name=${foodName}`
       
    }
}



