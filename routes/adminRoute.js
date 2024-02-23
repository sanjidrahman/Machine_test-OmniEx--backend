const express = require('express')
const route = express()
const entityController = require('../controllers/entityController')
const sendRecordController = require('../controllers/sendRecordController')
const quoteLedgerController = require('../controllers/quoteLedgerController')
const stockController = require('../controllers/stockController')

route.post('/entity', entityController.addEntity)
route.get('/entity', entityController.getAllEntity)
route.delete('/entity/:id', entityController.deleteEntity)
route.post('/report', entityController.calcSupplier)

route.post('/sendrecord', sendRecordController.addSendRecord)
route.get('/sendrecord', sendRecordController.getAllSendRecord)
route.delete('/sendrecord/:id', sendRecordController.deleteSendRecord)

route.post('/quoterecord', quoteLedgerController.addQuoteRecord)
route.get('/quoterecord', quoteLedgerController.getAllQuoteRecord)
route.delete('/quoterecord/:id', quoteLedgerController.deleteQuoteRecord)

route.post('/stock', stockController.addStockRecord)
route.get('/stock', stockController.getAllStockRecord)
route.delete('/stock/:id', stockController.deleteStock)

module.exports = route