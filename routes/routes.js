const express = require('express'),
    router = express.Router(),
    {
      indexPage,
      signUpPage,
      login,
      createNewUser
    } = require('../controllers/controller');
  

router.route('/').get(indexPage); 
router.route('/signup').get(signUpPage).post(createNewUser);
router.route('/login').post(login);



module.exports = router; 