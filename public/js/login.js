const email = document.getElementById('email'),
    password = document.getElementById('password'),
    warningBtn = document.getElementById('warningBtn'),
    form = document.getElementById('form'),
    root = `${location.protocol}//${location.host}`;  

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
    const data = {
        email: email.value,
        password: password.value,
    };

    console.log(data); 
    post(`${root}/auth/login`, data)
        .then(data => {
            if(data.success == false){
                warningBtn.innerHTML = data.error;
                warningBtn.style.color = 'red';
            }else{
                window.location.href = `${root}/user/dashboard`;
            }

        })
        .catch(err => console.log(err));
})
