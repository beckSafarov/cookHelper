const sidenav = document.querySelector('.sidenav'); 
M.Sidenav.init(sidenav, {}); 
const tabs = document.getElementById('tabs'); 
const fastFoodsTab = document.getElementById('fastFoodsTab'); 
const recFoodsTab = document.getElementById('recFoodsTab');
const meatCornerTab = document.getElementById('meatCornerTab');
const lowFatTab = document.getElementById('lowFatTab');
M.Tabs.init(tabs, {});
   
  // fastFoodsTab.addEventListener('click', (e)=>{
  //   e.preventDefault(); 
  //   fastFoodsTab.class = 'active'; 
  //   recFoodsTab.class = ''; 
  //   meatCornerTab.class = ''; 
  //   lowFatTab.class = ''; 
  // })
  // recFoodsTab.addEventListener('click', (e)=>{
  //   e.preventDefault(); 
  //   fastFoodsTab.class = ''; 
  //   recFoodsTab.class = 'active'; 
  //   meatCornerTab.class = ''; 
  //   lowFatTab.class = ''; 
  // })
  // meatCornerTab.addEventListener('click', (e)=>{
  //   e.preventDefault(); 
  //   fastFoodsTab.class = ''; 
  //   recFoodsTab.class = ''; 
  //   lowFatTab.class = ''; 
  //   // meatCornerTab.style.backgroundColor = 'indigo'; 
  //   window.location.href = '?category=meatcorner';
  // })
  // lowFatTab.addEventListener('click', (e)=>{
  //   e.preventDefault(); 
  //   fastFoodsTab.class = ''; 
  //   recFoodsTab.class = ''; 
  //   meatCornerTab.class = ''; 
  //   lowFatTab.class = 'active'; 
  // })
  
