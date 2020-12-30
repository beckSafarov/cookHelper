const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      login,
      dashboard,
      searchPage,
      ingredients
    } = require('../controllers/userController'),
    {
      urlDirect,
      protect
    } = require('../middleware/auth'); 


  


router.route('/signup').post(createNewUser);
router.route('/login').post(login);
router.route('/dashboard').get(protect, dashboard);
router.route('/search').get(protect, searchPage);
router.route('/search/ingredients').get(protect, ingredients);




module.exports = router; 