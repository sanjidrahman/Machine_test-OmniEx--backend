const mongoose = require('mongoose')

const sendRecordModel = new mongoose.Schema({
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
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('sendRecord', sendRecordModel)