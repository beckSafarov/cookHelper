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
   document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.autocomplete');
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
            output.className = 'chosenIngredient'; 
            output.innerHTML = ingredientsField.value; 
        }
    });
  });