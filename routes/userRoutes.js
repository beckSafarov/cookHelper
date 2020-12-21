const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      login,
      dashboard,
      searchPage
    } = require('../controllers/userController');

  


router.route('/signup').post(createNewUser);
router.route('/login').post(login);
router.route('/:id/dashboard').get(dashboard);
router.route('/:id/search').get(searchPage);




module.exports = router; 