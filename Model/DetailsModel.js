// server/Model/CustomerModel.js
const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
    required: true,
  },
  purposeOfVisit: {
    type: String,
    required: true,
  },
  nextVisit: {
    type: Date,
  },
  remark: {
    type: String,
  },
});

const DetailsModel = mongoose.model('Detail', detailsSchema);

module.exports = DetailsModel;
