const express = require('express'),
    User = require('../modules/user');

//@desc      Open the home page
//@route     GET /
//@access    Public
exports.indexPage = (req, res, next) => {
    res.render('index'); 
  };

//@desc      Sign up page
//@route     GET /signup 
//@access    Public
exports.signUpPage = (req, res, next) => {
    res.render('signup'); 
  };

//@desc      create/sign-up a new user, 
//@route     POST /signup 
//@access    Public
exports.createNewUser = async(req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: newUser,
  });
};

//@desc      login
//@route     POST /login
//@access    Public
exports.login = (req, res, next) => {
    res.json({ success: true, msg: 'Let\'s imagine that you have entered your login credentials' });
 };
 
