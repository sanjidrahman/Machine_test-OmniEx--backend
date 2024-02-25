const entityModel = require("../models/entityModel");
const quoteLedgerModel = require("../models/quoteLedgerModel");

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

        let format;
        const inputDate = req.body.date ? new Date(req.body.date) : new Date()
        if (!req.body.date) {
            const currDay = new Date().toISOString()
            format = currDay.split('T')[0]
        } else {
            inputDate.setDate(inputDate.getDate() + 1)
            const serverDate = inputDate.toISOString()
            format = serverDate.split('T')[0]
        }

        const report = await quoteLedgerModel.aggregate([
            {
                $match: {
                    date: new Date(format)
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
                $group: {
                    _id: {
                        supplierId: '$supplierId',
                        buyerId: '$buyerId'
                    },
                    totalQuoteAmount: { $sum: '$amount' },
                    avgRate: { $avg: '$rate' }
                }
            },
            {
                $lookup: {
                    from: 'sendrecords',
                    localField: '_id.supplierId',
                    foreignField: 'supplierId',
                    as: 'sendRecordData'
                }
            },
            {
                $unwind: '$sendRecordData'
            },
            {
                $match: {
                    'sendRecordData.date': new Date(format)
                }
            },
            {
                $group: {
                    _id: {
                        supplierId: '$sendRecordData.supplierId',
                        buyerId: '$sendRecordData.buyerId'
                    },
                    totalsendRecordAmount: { $sum: '$sendRecordData.amount' },
                    previousGroupData: { $mergeObjects: '$$ROOT' }
                }
            },
            {
                $addFields: {
                    totalDueAmount: { $subtract: ["$totalsendRecordAmount", "$previousGroupData.totalQuoteAmount"] }
                }
            },
            {
                $lookup: {
                    from: 'entities',
                    localField: '_id.supplierId',
                    foreignField: '_id',
                    as: 'supplierData'
                }
            },
            {
                $unwind: '$supplierData'
            },
            {
                $lookup: {
                    from: 'entities',
                    localField: '_id.buyerId',
                    foreignField: '_id',
                    as: 'buyerData'
                }
            },
            {
                $unwind: '$buyerData'
            },
            {
                $project: {
                    _id: 0,
                    'previousGroupData.avgRate': 1,
                    totalDueAmount: 1,
                    supplierData: 1,
                    buyerData: 1
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