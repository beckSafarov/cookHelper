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
  if(window.location.href.includes('recfoods') || window.location.href.endsWith('dashboard') ){
    recFoodsTab.className = 'active'; 
    featuredSideTab.style.backgroundColor = '#ee7176'; 

  }else if(window.location.href.endsWith('fastfoods')){
    fastFoodSideTab.style.backgroundColor = '#ee7176'; 
    fastFoodsTab.className = 'active';

  }else if(window.location.href.includes('lowfat')){
    lowFatSideTab.style.backgroundColor = '#ee7176'; 
    lowFatTab.className = 'active';

  }else if(window.location.href.includes('meatcorner')){
    meatCornerSideTab.style.backgroundColor = '#ee7176'; 
    meatCornerTab.className = 'active';
  }
});



function sendToRelevantPage(){
  window.location.href = '?category=meatcorner';
}

function searchPage(){
  const url = window.location.href; 
  const urlArray = url.split('/');
  const userId = urlArray[4]; 
  window.location.href = `http://localhost:5000/user/${userId}/search`; 

}