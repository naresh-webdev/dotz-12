const mongoose = require('mongoose');

const adminDataSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'adminData' });

module.exports = mongoose.model('AdminData', adminDataSchema);