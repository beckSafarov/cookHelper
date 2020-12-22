const express = require('express'),
    router = express.Router(),
    {
        foods, 
        users
    } = require('../controllers/apiController'); 


router.route('/foods').get(foods); 
router.route('/:specialpass/users').get(users); 

module.exports = router; 