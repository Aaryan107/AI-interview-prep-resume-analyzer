const userModel = require('../models/user.model')
const BlacklistModel = require('../models/blacklist.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
/*
@name registerUser
@description register user,expects username,email,password
@access public
*/
async function registerUser(req, res) {
    console.log("Register request received with body:", req.body);
    try {
        let { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'all fields are required'
            })
        }

        const userAlreadyExists = await userModel.findOne(
            {
                $or: [{ username }, { email }]
            }
        )

        if (userAlreadyExists) {
            console.log("Registration failed: User already exists");
            return res.status(400).json({
                message: 'user already exists'
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        console.log("User created successfully in database:", user);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        res.cookie('token', token)

        res.status(201).json({
            message: 'user created',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Database or Server Error during registration:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

/*
@name loginUser
@description login user,expects email,password
@access public
*/
async function loginUser(req, res) {

    let { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: 'user not found'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'invalid password'
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

    res.cookie('token', token)

    res.status(200).json({
        message: 'user logged in',
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/*
@name logoutUser
@description logout user
@access public
*/
async function logoutUser(req, res) {

    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message: 'already logged out'
        })
    }

    const blacklistedToken = await BlacklistModel.create({
        token
    })

    res.clearCookie('token')

    res.status(200).json({
        message: 'user logged out'
    })
}

async function getUser(req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: 'user found',
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}