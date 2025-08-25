const mongoose = require('mongoose');

const adminDataSchema = new mongoose.Schema({
  email: String,
  password: String
}, { collection: 'adminData' });

module.exports = mongoose.model('AdminData', adminDataSchema);