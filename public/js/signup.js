const name = document.getElementById('name'),
    email = document.getElementById('email'),
    password = document.getElementById('password'),
    weight = document.getElementById('weight'),
    height = document.getElementById('height'),
    experience = document.getElementById('experience'),
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
    if(password.value.length > 5 && experience.value !== 'Options'){
        const data = {
            name: name.value,
            email: email.value, 
            password: password.value,
            weight: weight.value,
            height: height.value,
            experience: experience.value
        };
        
        console.log(data);
        post(`${root}/auth/signup`, data)
            .then(data => {
                if(data.success == false){
                    warningBtn.innerHTML = data.error; 
                }else{
                    window.location.href = `${root}/login`;
                }
                
            })
            .catch(err => console.log(err));
    }else{
        if(password.value.length < 6){
            warningBtn.innerHTML = `Your password is too short`;
        }else{
            warningBtn.innerHTML = `Please choose an option for your experience`;
        }
        
    }
    

})//end of the event listener




