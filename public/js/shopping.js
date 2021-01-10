const root = `${location.protocol}//${location.host}`; 
const sidenav = document.querySelector('.sidenav');
let ingredientTask = document.querySelector('.collection'); 
let clearBtn = document.getElementById('clearBtn'); 
let heading = document.querySelector('.heading'); 


loadAllEventListeners(); 

function loadAllEventListeners(){
    document.addEventListener('DOMContentLoaded', starter); 
    clearBtn.addEventListener('click', clearAll); 
    ingredientTask.addEventListener('click', function(e){
        removeFromView(e); 
    })
}

function starter(){
    //side navigation
    M.Sidenav.init(sidenav, {});

}

function removeFromView(e){
    e.preventDefault();
    listLengthController();
    let chosenRow; 
    if(e.target.parentElement.className === 'done'){
        chosenRow = e.target.parentElement.parentElement; 
        e.target.parentElement.innerHTML = '<i style="margin-right: 13px;" class="fas fa-check-circle"></i>';
        
        setTimeout(function(){
            chosenRow.remove();
        }, 150); 
    }
}//end of the removeFromView

function cleanEverything(){
    ingredientTask.remove();
    clearBtn.classList.add('hide'); 
    heading.innerHTML = 'Your Shopping List is empty';

}

async function removeFromDB(ingredientName, foodName){
    const data = {ingredientName, foodName};
    const response = await fetch(`${root}/user/shoppinglist/remove`, {
        method: 'PUT',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    });
    const resData = await response.json(); 
    if(resData.success == true){
        console.log('the task has been removed'); 
    }else{
        console.log('something went wrong'); 
    }
}

async function clearAll(){
    if(confirm('Are you sure to delete everything?')){
        cleanEverything(); 
        const response = await fetch(`${root}/user/shoppinglist/flush`, {
            method: 'PUT'
        });
        const resData = await response.json(); 
        console.log(resData);

        if(resData.success = true){
            M.toast({html: 'List has been destroyed'})
            console.log(resData); 
        }else{
            M.toast({html: 'Sorry something went wrong'})
            console.log(resData.error); 
        }
    }
}


function listLengthController(){
    listLength -= 1; 
    if(listLength === 0){
        cleanEverything();
    }
}






