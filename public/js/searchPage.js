let ingredientsField = document.querySelector('.autocomplete');
    const output = document.querySelector('#output');
    const outputBtn = document.getElementById('outputBtn'); 
    const warning = document.getElementById('warning');
    const ingredients = {
        "Tomato": null,
        "Potato": null, 
        "Rice": null,
        "Bread": null,
        "Pasta": null, 
        "Avocado": null
    }
    const foods = {
        "Hamburger": null, 
        "Cheeseburger": null, 
        "Hot dog": null
    }
   document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.autocomplete');
    const url = window.location.href; 
    if(url.endsWith('search') || url.includes('general')){
        var instances = M.Autocomplete.init(elems, {
            data: foods,
        });

        outputBtn.addEventListener('click', function(e){
            e.preventDefault(); 
            if(ingredientsField.value == ''){
                warning.innerHTML = 'Please enter an ingredient'; 
                warning.style.color = 'red'; 
            }else{
                warning.innerHTML = '';
                output.className = 'tag'; 
                output.innerHTML = ingredientsField.value; 
            }
        });

    }else if(url.includes('ingredients')){
        var instances = M.Autocomplete.init(elems, {
            data: ingredients,
        });
    
        outputBtn.addEventListener('click', function(e){
            e.preventDefault(); 
            if(ingredientsField.value == ''){
                warning.innerHTML = 'Please enter an ingredient'; 
                warning.style.color = 'red'; 
            }else{
                warning.innerHTML = '';
                output.className = 'tag'; 
                output.innerHTML = ingredientsField.value; 
            }
        });
    }
  });