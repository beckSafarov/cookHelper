const express = require('express'),
    router = express.Router(),
    {
      indexPage, 
      signUpPage,
      loginPage
    } = require('../controllers/pageController'),
    {
      urlDirect,
      protect
    } = require('../middleware/auth'); 
    

  
router.route('/').get(urlDirect, indexPage); 
router.route('/signup').get(signUpPage); 
router.route('/login').get(loginPage); 




module.exports = router; 