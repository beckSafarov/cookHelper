const express = require('express'),
    router = express.Router(),
    {
      indexPage, 
      signUpPage,
      loginPage
    } = require('../controllers/pageController');
    

  
router.route('/').get(indexPage); 
router.route('/signup').get(signUpPage); 
router.route('/login').get(loginPage); 




module.exports = router; 