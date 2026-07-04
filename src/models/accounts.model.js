const mongoose = require('mongoose');
const ledgerModel = require('../models/ledger.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Account must be associated with a user'],
        index: true // index is given to find the account quickly, B+ Tree concept is used.
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVE', 'FROZEN', 'CLOSED'],
            message: 'Status can be either FROZEN, ACTIVE or CLOSED'
        },
        default: 'ACTIVE',
        required: true,
    },
    currency: {
        type: String,
        required: [true, 'Currency is required for creating an account'],
        default: 'INR',
        uppercase: true,
        trim: true,
    }
}, {
    timestamps: true
})

// creating an compound index
// 🚀  Highly optimized Compound Index.
//     Speeds up queries searching for:
//   - A specific user's active accounts: find({ user: id, status: 'ACTIVE' })
//   - All accounts belonging to a user: find({ user: id })
accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function (explicitId) {

    // Fallback securely to the explicit parameter if 'this' loses context
    const targetId = explicitId || this._id;

    if (!targetId) {
        return 0;
    }

    const accountObjectId = new mongoose.Types.ObjectId(targetId);

    // Perform real-time double-entry math calculation on the ledger entries
    const balanceData = await mongoose.model('ledger').aggregate([
        {
            $match: {
                account: accountObjectId
            }
        },
        {
            $group: {
                _id: null,
                totalDebits: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0]
                    }
                },
                totalCredits: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ['$totalCredits', '$totalDebits'] }
            }
        }
    ]);

    // If no transactions have occurred yet, balance is naturally 0
    if (balanceData.length === 0) {
        return 0;
    }

    return balanceData[0].balance;
};

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;