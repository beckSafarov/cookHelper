const express = require('express'),
    router = express.Router(),
    { 
      createNewUser,
      createMultipleUsers,
      login,
      deleteUser,
      deleteAll,
      logout,
      getCurrentUser
    } = require('../controllers/authController'),
    {
      protect,
      urlDirect
    } = require('../middleware/auth');

router.route('/signup').post(createNewUser);
router.route('/signupmultiple').post(createMultipleUsers);
router.route('/delete/:id').delete(deleteUser);
router.route('/delete').delete(deleteAll);
router.route('/login').post(login);
router.route('/logout').get(protect, logout);
router.get('/currentuser', protect, getCurrentUser); 

module.exports = router; 