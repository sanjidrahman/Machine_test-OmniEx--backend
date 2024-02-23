const entityModel = require("../models/entityModel");
const quoteLedgerModel = require("../models/quoteLedgerModel");
const sendRecordModel = require("../models/sendRecordModel");
const moment = require('moment');

const getAllEntity = async (req, res) => {
    try {
        const allEntities = await entityModel.find()
        res.status(200).json({ allEntities })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const addEntity = async (req, res) => {
    try {
        const { name, type, bankAccount } = req.body
        const newEntity = new entityModel({
            name,
            type,
            bankDetails: bankAccount
        })
        await newEntity.save()
        res.status(201).json({ message: 'Created' })

    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const deleteEntity = async (req, res) => {
    try {
        const e_id = req.params.id
        await entityModel.deleteOne({ _id: e_id })
        res.status(200).json({ message: 'Success' })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const calcSupplier = async (req, res) => {
    try {

        const inputDate = req.body.date;
        const serverDate = moment(req.body.date).format('YYYY-MM-DD')
        console.log(inputDate, serverDate);
        const report = await quoteLedgerModel.aggregate([
            {
                $match: {
                    date: new Date(serverDate)
                }
            },
            {
                $lookup: {
                    from: 'entities',
                    localField: 'supplierId',
                    foreignField: '_id',
                    as: 'supplierData'
                }
            },
            {
                $unwind: '$supplierData'
            },
            {
                $match: {
                    'supplierData.type': 'Supplier'
                }
            },
            {
                $lookup: {
                    from: 'sendrecords',
                    localField: 'supplierId',
                    foreignField: 'supplierId',
                    as: 'sendRecordData'
                }
            },
            {
                $unwind: '$sendRecordData'
            },
            {
                $match: {
                    'sendRecordData.date': new Date(serverDate)
                }
            },
            {
                $addFields: {
                    dueAmount: { $subtract: ["$sendRecordData.amount", "$amount"] }
                }
            },
            {
                $group: {
                    _id: '$supplierData._id',
                    avg_rate: { $avg: '$rate' },
                    supplierData: { $first: '$supplierData' },
                    dueAmount: { $first: '$dueAmount' }
                }
            },
            // In the case if buyer name is needed
            // {
            //     $lookup: {
            //         from: 'entities',
            //         localField: 'buyerId',
            //         foreignField: '_id',
            //         as: 'buyerData'
            //     }
            // },
            // {
            //     $unwind: '$buyerData'
            // },
        ]);
        return res.status(200).json({ report })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


module.exports = {
    addEntity,
    getAllEntity,
    deleteEntity,
    calcSupplier,
}