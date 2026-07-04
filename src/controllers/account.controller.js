const accountModel = require('../models/accounts.model');


const createAccountController = async (req, res) => {
    try {

        const isLoggedInUser = req.user;

        const newAccount = await accountModel.create({
            user: isLoggedInUser._id,
            currency: 'INR'
        })

        return res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            newAccount
        })


    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal error while creating an account',
            error: err.message
        });
    }
}

const getUserAccountsController = async (req, res) => {

    try {

        const accounts = await accountModel.find({
            user: req.user._id,
        })

        res.status(200).json({
            accounts,
        })

    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal error while fetching accounts',
            error: err.message
        });
    }
}
const getAccountBalanceController = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id,
        });

        if (!account) {
            return res.status(404).json({
                message: 'Account not found',
            });
        }

        // 🟢 FIX: Explicitly pass the ID to bypass Mongoose context binding failures
        const balance = await account.getBalance(account._id);

        return res.status(200).json({
            accountId: account._id,
            balance
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error calculating balance metrics',
            error: err.message
        });
    }
};

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController,
};