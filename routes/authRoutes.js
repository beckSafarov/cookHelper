const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      createMultipleUsers,
      login,
      deleteUser,
      deleteAll
    } = require('../controllers/authController');

router.route('/signup').post(createNewUser);
router.route('/signupmultiple').post(createMultipleUsers);
router.route('/delete/:id').delete(deleteUser);
router.route('/delete').delete(deleteAll);
router.route('/login').post(login);

module.exports = router; 