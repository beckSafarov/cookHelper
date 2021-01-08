const express = require('express'),
    router = express.Router(),
    {
        foods,
        searchFood, 
        searchFoodByIngredient,
        users,
        recommended,
        getLikes
    } = require('../controllers/apiController'); 


router.route('/foods').get(foods); 
router.route('/:specialpass/users').get(users); 
router.route('/:specialpass/recommended').get(recommended); 
router.route('/foods/:food').get(searchFood);
router.route('/foods/:foodId/likes').get(getLikes);
router.route('/ingredients/:ingredient').get(searchFoodByIngredient);
module.exports = router; 