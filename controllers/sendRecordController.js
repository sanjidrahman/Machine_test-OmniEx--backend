const sendRecordModel = require("../models/sendRecordModel")
const moment = require('moment');

const getAllSendRecord = async (req, res) => {
    try {
        const sendRecords = await sendRecordModel.find().populate('buyerId').populate('supplierId')
        res.status(200).json({ sendRecords })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const addSendRecord = async (req, res) => {
    try {
        const { buyer, supplier, date, time, amount } = req.body
        const buyerId = buyer._id
        const supplierId = supplier._id
        const serverDate = moment(date).format('YYYY-MM-DD')
        console.log(`${date} ||| ${serverDate}`);
        const newRecord = new sendRecordModel({
            buyerId,
            supplierId,
            date: serverDate,
            time,
            amount
        })
        await newRecord.save()
        res.status(201).json({ message: 'Created' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const deleteSendRecord = async (req, res) => {
    try {
        const s_id = req.params.id
        await sendRecordModel.deleteOne({ _id: s_id })
        res.status(200).json({ message: 'Success' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    addSendRecord,
    getAllSendRecord,
    deleteSendRecord,
}