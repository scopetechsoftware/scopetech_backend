const mongoose = require('mongoose');

const installmentSchema = mongoose.Schema({
    register: {type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: true},
    paymentType: String,
    amountReceived: Number,
    receiptGen: String,
    balance: String,
    nextIns: Date,
    totalReceived: String,
}, {timestamps: true})

module.exports = mongoose.model('Installment', installmentSchema);