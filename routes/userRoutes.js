const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      login
    } = require('../controllers/userController');

  


router.route('/signup').post(createNewUser);
router.route('/login').post(login);



module.exports = router; 