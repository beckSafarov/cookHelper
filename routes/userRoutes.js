const express = require('express'),
    router = express.Router(),
    { 
      dashboard,
      searchPage,
      ingredients,
      foodPage,
      foodLikedController,
      shoppingListPage,
      addToShoppingList,
      removeFromShoppingList,
      flushShoppingList,
      foodUnlikedController,
      altIngredients
    } = require('../controllers/userController'),
    {
      urlDirect,
      protect
    } = require('../middleware/auth'); 

router.route('/dashboard').get(protect, dashboard);
router.route('/search').get(protect, searchPage);
router.route('/shoppinglist').get(protect, shoppingListPage);
router.route('/search/ingredients').get(protect, ingredients);
router.route('/food/:foodId').get(protect, foodPage);
router.route('/food/:foodId/liked').put(protect, foodLikedController);
router.route('/food/:foodId/unliked').put(protect, foodUnlikedController);
router.post('/shoppinglist/add', protect, addToShoppingList);
router.put('/shoppinglist/remove', protect, removeFromShoppingList);
router.put('/shoppinglist/flush', protect, flushShoppingList);






module.exports = router; 