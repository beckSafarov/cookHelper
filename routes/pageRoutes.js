const express = require('express'),
    router = express.Router(),
    {
      indexPage, 
      signUpPage
    } = require('../controllers/pageController');
    

  
router.route('/').get(indexPage); 
router.route('/signup').get(signUpPage); 




module.exports = router; 