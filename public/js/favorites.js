const sidenav = document.querySelector('.sidenav');
      

document.addEventListener('DOMContentLoaded', function(){

    //select tab content
    // var elems = document.querySelectorAll('select');
    // var instances = M.FormSelect.init(elems, {});

    //init sidenav
    M.Sidenav.init(sidenav, {})

    //init drop down
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {
        coverTrigger: false,
        hover: true,
        constrainWidth: false
    });

    
})