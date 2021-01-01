const descriptionTab = document.getElementById('#description');
const ingredientsTab = document.getElementById('#ingredients');
const stepsTab = document.getElementById('#steps');
let likeButton = document.querySelector('#like-button'); 
let foodLiked = false; 


loadAllEventListeners(); 
function loadAllEventListeners(){
    document.addEventListener('DOMContentLoaded', starter);
    likeButton.addEventListener('keyup', function(e){
        e.preventDefault();
        likeButtonController();
    });
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


