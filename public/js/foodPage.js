const descriptionTab = document.getElementById('#description');
const ingredientsTab = document.getElementById('#ingredients');
const stepsTab = document.getElementById('#steps');
const shoppingBtn = document.getElementById('shoppingBtn');
const warning = document.getElementById('warning');
let likeButton = document.querySelector('#like-button'); 
let root = `${location.protocol}//${location.host}`; 
let foodLiked = false; 


loadAllEventListeners(); 
function loadAllEventListeners(){
    document.addEventListener('DOMContentLoaded', starter);
    likeButton.addEventListener('keyup', function(e){
        e.preventDefault();
        likeButtonController();
    });
    shoppingBtn.addEventListener('click', addToShoppingList); 
}

function starter(){
    //init photo materialboxed 
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
    //init tooltip 
    elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, {});
    //init sideNav
    const sidenav = document.querySelector('.sidenav'); 
    M.Sidenav.init(sidenav, {});
    //init tabs bar
    const el = document.getElementById('tabsBar'); 
    var instance = M.Tabs.init(el, {});
    //init description tab
    moveToDescription();
}


//FUNCTION FOR TABS TOGGLE

function moveToIngredients(){
    ingredientsTab.className = ''; 
    descriptionTab.className = 'hide'; 
    stepsTab.className = 'hide'; 
}

function moveToSteps(){
    ingredientsTab.className = 'hide'; 
    descriptionTab.className = 'hide'; 
    stepsTab.className = '';
}

function moveToDescription(){
    descriptionTab.className = ''; 
    stepsTab.className = 'hide'; 
    ingredientsTab.className = 'hide'; 
}

//FUNCTION TO CONTROL THE LIKE BUTTON  
function likeButtonController(){
    if(!foodLiked){
        likeButton.childNodes[1].style.color = 'magenta'; 
        foodLiked = true; 
    }else{
        likeButton.childNodes[1].style.color = 'pink';
        foodLiked = false; 
    }
}

async function addToShoppingList(){
    let urlArray = location.href.split('/'); 
    const foodId = urlArray.pop(); 
    const data = {
        id: foodId 
    }
    
    const response = await fetch(`${root}/user/shoppinglist/add`, {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    }); 
    const resData = await response.json();
    if(resData.success == true){
        warning.innerHTML = 'List has been added!'; 
        warning.style.color = 'green'; 
    }else{
        warning.innerHTML = resData.error; 
        console.log(resData);
    }
}//end of the addToShoppingList() function 


