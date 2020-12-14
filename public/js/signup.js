const name = document.getElementById('name'),
    email = document.getElementById('email'),
    password = document.getElementById('password'),
    weight = document.getElementById('weight'),
    height = document.getElementById('height'),
    submitBtn = document.getElementById('submitBtn'),
    warningBtn = document.getElementById('warningBtn'),
    form = document.getElementById('form');

//post function to make a post request to the server
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

form.addEventListener('submit', function(e){
    e.preventDefault();
    if(password.value.length > 5){
        const data = {
            name: name.value,
            email: email.value, 
            password: password.value,
            weight: weight.value,
            height: height.value
        };
    
        post(`${process.env.URL}/user/signup`, data)
            .then(data => {
                if(data.success == false){
                    warningBtn.innerHTML = data.error; 
                }else{
                    window.location.href = `${process.env.URL}/login.html`;
                }
                
            })
            .catch(err => console.log(err));
    }else{
        warningBtn.innerHTML = `Your password is too short`;
    }
    

})//end of the event listener




