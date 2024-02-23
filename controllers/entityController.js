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
        const serverDate = moment(inputDate).format('YYYY-MM-DD')
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
                $lookup: {
                    from: 'entities',
                    localField: 'buyerId',
                    foreignField: '_id',
                    as: 'buyerData'
                }
            },
            {
                $unwind: '$buyerData'
            },
            {
                $group: {
                    _id: '$supplierData._id',
                    avgRate: { $avg: '$rate' },
                    data: { $push: '$$ROOT' } // Preserve all fields in the original documents
                }
            },
            {
                $unwind: '$data'
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ['$data', { avgRate: '$avgRate' }] } } // Merge the avgRate field with the original document
            },
            {
                $project: {
                    _id: 0,
                    avgRate: 1,
                    'supplierData.name': 1,
                    'buyerData.name': 1,
                    dueAmount: 1
                }
            }
        ]);
        return res.status(200).json({ report })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


module.exports = {
    addEntity,
    getAllEntity,
    deleteEntity,
    calcSupplier,
}