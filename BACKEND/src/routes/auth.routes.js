const express = require('express')

const router = express.Router()

const authController = require('../controllers/auth.controller')

const authMiddleware = require('../middleware/auth.middleware')
/*
*@route POST /api/auth/register
*@description Register a user
*@access Public
*/
router.post('/register',authController.registerUser)

/*
*@route POST /api/auth/login
*@description Login a user ,with email & password
*@access Public
*/
router.post('/login',authController.loginUser)

/*
*@route POST /api/auth/logout
*@description Logout a user
*@access Public
*/
router.get('/logout',authController.logoutUser)

/*
*@route GET /api/auth/get-user
*@description Protected route,to get user info
*@access Private
*/
router.get('/get-user',authMiddleware.authUser,authController.getUser)

module.exports = router