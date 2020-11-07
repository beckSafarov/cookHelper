const express = require('express'),
    router = express.Router();

//@desc      Open the home page
//@route     GET /
//@access    Public
router.get('/', (req, res, next) => {
    res.render('index'); 
  //res.json({ success: true, msg: 'Home page: So happy to see you back' });
});

//@desc      login
//@route     POST /login
//@access    Public
router.post('/login', (req, res, next) => {
   res.json({ success: true, msg: 'Let\'s imagine that you have entered your login credentials' });
});

//@desc      Sign up page
//@route     POST /login
//@access    Public
router.get('/signup', (req, res, next) => {
    res.json({ success: true, msg: 'Signup page: Sign up to use our app' });
 });



module.exports = router; 