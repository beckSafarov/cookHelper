const sidenav = document.querySelector('.sidenav'); 
M.Sidenav.init(sidenav, {}); 
const tabs = document.getElementById('tabs'); 
const fastFoodsTab = document.getElementById('fastFoodsTab'); 
const recFoodsTab = document.getElementById('recFoodsTab');
const meatCornerTab = document.getElementById('meatCornerTab');
const lowFatTab = document.getElementById('lowFatTab');
const cardPhotos = document.querySelectorAll('.card-photo'),
  featuredSideTab = document.getElementById('featuredSideTab'),
  fastFoodSideTab = document.getElementById('fastFoodSideTab'),
  meatCornerSideTab = document.getElementById('meatCornerSideTab'),
  lowFatSideTab = document.getElementById('lowFatSideTab');
  

M.Tabs.init(tabs, {});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById(selectedTab).style.color = '#EE7176'; 
  document.getElementById(selectedSideTab).style.backgroundColor = '#EE7176'; 

  //select tab content
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});

