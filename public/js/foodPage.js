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

    //init likebutton 
    if(likeStatus == 'true'){
        foodLiked = true; 
        likeButton.childNodes[1].style.color = 'magenta'; 
    }

    //init drop down
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {
        coverTrigger: false,
        hover: true,
        constrainWidth: false
    });
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
async function likeButtonController(){
    const foodId = getFoodId(); 
    if(!foodLiked){
        likeButton.childNodes[1].style.color = 'magenta'; 
        foodLiked = true; 
        
        const response = await fetch(`${root}/user/food/${foodId}/liked`, {
            method: 'PUT'
        });
        const resData = await response.json(); 
        if(!resData.success){
            console.log(resData); 
        }else{
            console.log(resData); 
        }
    }else{
        likeButton.childNodes[1].style.color = 'pink';
        foodLiked = false; 
        const response = await fetch(`${root}/user/food/${foodId}/unliked`, {
            method: 'PUT'
        });
        const resData = await response.json(); 
        if(!resData.success){
            console.log(resData); 
        }else{
            console.log(resData); 
        }

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
        M.toast({
            html: 'List has been added!', 
            classes: 'rounded'
        });
    }else{
        M.toast({html: 'Sorry something went wrong', classes: 'rounded'});
        console.log(resData);
    }
}//end of the addToShoppingList() function 


function getFoodId(){
    let urlArray = location.href.split('/'); 
    const foodId = urlArray.pop(); 
    return foodId; 
}
