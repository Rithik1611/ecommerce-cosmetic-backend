const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));


app.get('/search', async (req, res) => {
  const color = req.query.color?.toLowerCase();

  if (!color) {
    return res.status(400).json({ error: 'Color query param is required' });
  }

  const products = await Product.find({ color });

  if (products.length === 0) {
    return res.status(404).json({ error: 'No products found for this color' });
  }

  const options = {};
  products.forEach(p => {
    if (!options[p.type]) options[p.type] = [];
    options[p.type].push({
      _id: p._id,
      brand: p.brand,
      price: p.price
    });
  });

  res.json({
    color,
    options
  });
});


app.post('/combo', async (req, res) => {
  const { color, selected } = req.body;

  if (!color || !selected) {
    return res.status(400).json({ error: 'Color and selected combo are required' });
  }

  let total = 0;
  let validatedCombo = {};

  for (const [type, productId] of Object.entries(selected)) {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ error: `Invalid product ID for ${type}` });
    }

    if (product.type !== type) {
      return res.status(400).json({ error: `Product type mismatch for ${type}` });
    }

    if (product.color !== color.toLowerCase()) {
      return res.status(400).json({ error: `Color mismatch for ${type}` });
    }

    validatedCombo[type] = {
      brand: product.brand,
      price: product.price
    };

    total += product.price;
  }

  res.json({
    color,
    selectedCombo: validatedCombo,
    total
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
