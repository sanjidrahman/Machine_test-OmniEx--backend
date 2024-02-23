const quoteLedgerModel = require("../models/quoteLedgerModel");
const moment = require('moment');

const getAllQuoteRecord = async (req, res) => {
    try {
       const receiveRecords = await quoteLedgerModel.find().populate('buyerId').populate('supplierId')
       res.status(200).json({ receiveRecords })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const addQuoteRecord = async (req, res) => {
    try {
        const { buyer, supplier, quantity, amount, rate, date, time } = req.body
        const buyerId = buyer._id
        const supplierId = supplier._id
        const serverDate = moment(date).format('YYYY-MM-DD')
        const newRecord = new quoteLedgerModel({
            buyerId,
            supplierId,
            date: serverDate,
            quantity,
            rate,
            time,
            amount
        })
        await newRecord.save()
        res.status(201).json({ message: 'Created' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const deleteQuoteRecord = async (req, res) => {
    try {
        const r_id = req.params.id
        await quoteLedgerModel.deleteOne({ _id: r_id })
        res.status(200).json({ message: 'Success' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getAllQuoteRecord,
    addQuoteRecord,
    deleteQuoteRecord,
}