const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      login,
      dashboard
    } = require('../controllers/userController');

  


router.route('/signup').post(createNewUser);
router.route('/login').post(login);
router.route('/dashboard').get(dashboard);



module.exports = router; 