const express = require('express'),
    router = express.Router(),
    {
        foods, 
        users,
        loadSomeFoods
    } = require('../controllers/apiController'); 


router.route('/foods').get(foods); 
router.route('/:specialpass/users').get(users); 
router.route('/loadsomefoods').post(loadSomeFoods); 

module.exports = router; 