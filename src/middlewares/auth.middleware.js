const userModel = require('../models/user.model');
const tokenBlackListModel = require('../models/blackList.model');

const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Authentication required. No session token found.',
                status: 'failed'
            });
        }

        const isBlackListed = await tokenBlackListModel.findOne({
            token,
        })

        if (isBlackListed) {
            return res.status(401).json({
                message: 'Unauthorised access, token is invalid'
            })
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(payload._id);

        if (!user) {
            return res.status(404).json({
                message: "User no longer exists"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({
            message: 'Authentication required. No session token found.',
            status: 'failed'
        });
    }
}

const authSystemUserMiddleware = async (req, res, next) => {


    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Authentication required. No session token found.',
            status: 'failed'
        });
    }

    const isBlackListed = await tokenBlackListModel.findOne({
        token,
    })

    if (isBlackListed) {
        return res.status(401).json({
            message: 'Unauthorised access, token is invalid'
        })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //const user = await userModel.findById(payload.userId).select('+systemUser');
        const targetId = payload.userId || payload.id || payload._id;

        const user = await userModel.findById(targetId).select('+systemUser');

        if (!user.systemUser) {
            return res.status(403).json({
                message: 'Forbidden access, not a System User',
            })
        }

        req.user = user;
        return next();
    } catch (err) {
        console.error("TOKEN DIAGNOSTIC FAILURE:", err.message);

        return res.status(401).json({
            message: 'Unauthorised access, token is invalid',
            status: 'failed',
            systemDiagnostic: err.message // Temporarily pass to Postman response
        });
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};