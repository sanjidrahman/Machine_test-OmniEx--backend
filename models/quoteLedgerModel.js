const mongoose = require('mongoose')

const quoteLedgerModel = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'entity',
        required: true
    },

    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'entity',
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    rate: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('quoteLedger', quoteLedgerModel)