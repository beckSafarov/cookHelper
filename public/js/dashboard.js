const sidenav = document.querySelector('.sidenav'); 
M.Sidenav.init(sidenav, {}); 
const tabs = document.getElementById('tabs'); 
const fastFoodsTab = document.getElementById('fastFoodsTab'); 
const recFoodsTab = document.getElementById('recFoodsTab');
const meatCornerTab = document.getElementById('meatCornerTab');
const lowFatTab = document.getElementById('lowFatTab');
const filter = document.getElementById('filter'); 
const cardPhotos = document.querySelectorAll('.card-photo'),
  featuredSideTab = document.getElementById('featuredSideTab'),
  fastFoodSideTab = document.getElementById('fastFoodSideTab'),
  meatCornerSideTab = document.getElementById('meatCornerSideTab'),
  lowFatSideTab = document.getElementById('lowFatSideTab');
  



document.addEventListener('DOMContentLoaded', function() {
  document.getElementById(selectedTab).style.color = '#EE7176'; 
  // console.log(selectTab);
  document.getElementById(selectedSideTab).style.backgroundColor = '#EE7176'; 

  //select tab content
  var selectElems = document.querySelectorAll('select');
  var selectInstances = M.FormSelect.init(selectElems, {});
  if(selectInstances.input){
    var instance = M.FormSelect.getInstance(selectInstances);
    console.log(instance.getSelectedValues());
  }


  M.Tabs.init(tabs, {});
  M.Sidenav.init(sidenav, {}); 

  //init drop down
  var dropdownElems = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(dropdownElems, {
      coverTrigger: false,
      hover: true,
      constrainWidth: false
  });
});



