const mongoose = require('mongoose')

const entitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    bankDetails: [{
        holderName: {
            type: String,
            required: true
        },

        accountNumber: {
            type: String,
            required: true
        },

        bankName: {
            type: String,
            required: true
        },

        ifsc: {
            type: String,
            required: true
        }
    }],

    type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('entity', entitySchema)