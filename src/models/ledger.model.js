const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Ledger must be associated with an account'],
        immutable: true, // once ledger is created you cant delete it
        index: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required for creating a ledger entry'],
        immutable: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
        required: [true, 'Ledger must be associated with a transaction'],
        index: true,
        immutable: true,
    },
    type: {
        type: String,
        enum: {
            values: ['CREDIT', 'DEBIT'],
            message: 'Type can be either CREDIT or DEBIT',
        },
        required: true,
        immutable: true,
    },
})

// once the ledger is created, it cant be modifed
// we use hooks to avoid any modifications


const preventLedgerModifications = () => {
    throw new Error('Ledger entries are immutable and cannot be either deleted or modified');
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModifications);
ledgerSchema.pre('findOneAndDelete', preventLedgerModifications);
ledgerSchema.pre('findOneAndReplace', preventLedgerModifications);
ledgerSchema.pre('updateOne', preventLedgerModifications);
ledgerSchema.pre('updateMany', preventLedgerModifications);
ledgerSchema.pre('deleteOne', preventLedgerModifications);
ledgerSchema.pre('deleteMany', preventLedgerModifications);
ledgerSchema.pre('remove', preventLedgerModifications);


const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;