const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  category: { type: String, required: true }, 
  brand: { type: String, required: true },
  color: { type: String, required: true }, 
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  affiliateUrl: { type: String, required: true },
  title: { type: String, required: true },
  asin: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
