const stockModel = require("../models/stockModel")

const getAllStockRecord = async (req, res) => {
    try {
        const stockRecords = await stockModel.find().populate('buyerId').populate('supplierId')
        res.status(200).json({ stockRecords })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

const addStockRecord = async (req, res) => {
    try {
        const { buyer, supplier, date, time, amount } = req.body
        const buyerId = buyer._id
        const supplierId = supplier._id
        // >>>>>>> Date conversion <<<<<<<<<
        const inputDate = new Date(date)
        inputDate.setDate(inputDate.getDate() + 1)
        const serverDate = inputDate.toISOString()
        const format = serverDate.split('T')[0]
        // >>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<
        const newRecord = new stockModel({
            buyerId,
            supplierId,
            date: format,
            time,
            amount
        })
        await newRecord.save()
        res.status(201).json({ message: 'Created' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error'})
    }
}

const deleteStock = async (req, res) => {
    try {
        const q_id = req.params.id
        await stockModel.deleteOne({ _id: q_id })
        res.status(200).json({ message: 'Success' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getAllStockRecord,
    addStockRecord,
    deleteStock,
}