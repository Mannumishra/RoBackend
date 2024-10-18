const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
    serviceNames: {
        type: String,
        required: true
    },
    itemCode: {
        type: String,
        required: true
    },
    boxNumber: {
        type: String,
        required: true
    },
    hsnCode: {
        type: String,
        required: true
    },
    purchaseAmount: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    }
})

const ItemServiceModel = mongoose.model("ItemService" , ItemSchema)

module.exports = ItemServiceModel