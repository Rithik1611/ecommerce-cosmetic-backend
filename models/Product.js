const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  type: { type: String, required: true }, 
  brand: { type: String, required: true },
  color: { type: String, required: true }, 
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
