const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      login,
      dashboard,
      searchPage,
      ingredients,
      foodPage,
      shoppingListPage,
      addToShoppingList,
      removeFromShoppingList,
      flushShoppingList
    } = require('../controllers/userController'),
    {
      urlDirect,
      protect
    } = require('../middleware/auth'); 

router.route('/signup').post(createNewUser);
router.route('/login').post(login);
router.route('/dashboard').get(protect, dashboard);
router.route('/search').get(protect, searchPage);
router.route('/shoppinglist').get(protect, shoppingListPage);
router.route('/search/ingredients').get(protect, ingredients);
router.route('/food/:foodId').get(protect, foodPage);
router.post('/shoppinglist/add', protect, addToShoppingList);
router.put('/shoppinglist/remove', protect, removeFromShoppingList);
router.put('/shoppinglist/flush', protect, flushShoppingList);






module.exports = router; 