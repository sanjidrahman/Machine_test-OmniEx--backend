const stockModel = require("../models/stockModel")
const moment = require('moment');

const getAllStockRecord = async (req, res) => {
    try {
        const stockRecords = await stockModel.find().populate('buyerId').populate('supplierId')
        res.status(200).json({ stockRecords })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

const addStockRecord = async (req, res) => {
    try {
        const { buyer, supplier, date, time, amount } = req.body
        const buyerId = buyer._id
        const supplierId = supplier._id
        const serverDate = moment(date).format('YYYY-MM-DD')
        const newRecord = new stockModel({
            buyerId,
            supplierId,
            date: serverDate,
            time,
            amount
        })
        await newRecord.save()
        res.status(201).json({ message: 'Created' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

const deleteStock = async (req, res) => {
    try {
        const q_id = req.params.id
        console.log(q_id, 'kkk');
        await stockModel.deleteOne({ _id: q_id })
        res.status(200).json({ message: 'Success' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getAllStockRecord,
    addStockRecord,
    deleteStock,
}