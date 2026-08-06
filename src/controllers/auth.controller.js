const userModel = require('../models/user.model');
const emailService = require('../services/email.service');
const tokenBlackListModel = require('../models/blackList.model'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRegisterController = async (req, res) => {
    try {

        // console.log("👉 WHAT IS EXPRESS RECEIVING?:", req.body);

        const { email, password, name } = req.body;

        const isAlreadyExists = await userModel.findOne({
            email
        })

        if (isAlreadyExists) {
            return res.status(422).json({
                message: 'Account already exists with this email',
                status: 'failed',
            })
        }

        const user = await userModel.create({
            name,
            email,
            password
        });

        const token = await jwt.sign({
            _id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.cookie('token', token);

        emailService.sendRegistrationEmail(user.email, user.name).catch(console.error);

        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });


    } catch (err) {
        return res.status(400).json({
            message: 'Internal error while creating an account',
            error: err.message
        })
    }
}

const userLoginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid Credentials',
                status: 'failed'
            });
        }

        // from the userModel part we used the comparePassword method
        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid Credentials',
                status: 'failed'
            });
        }

        const token = await jwt.sign({
            _id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.cookie('token', token);

        return res.status(200).json({
            message: 'Account logged in successfully',
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });


    } catch (err) {
        return res.status(400).json({
            message: 'Internal error , while logging in',
            error: err.message
        })
    }
}

const userLogoutController = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};