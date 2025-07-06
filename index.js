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

  const category = {};
  products.forEach(p => {
    if (!category[p.category]) category[p.category] = [];
    category[p.category].push({
      _id: p._id,
      brand: p.brand,
      price: p.price,
      imageUrl: p.imageUrl,
      affiliateUrl: p.affiliateUrl,
      title: p.title,
      asin: p.asin
    });
  });

  res.json({
    color,
    category
  });
});


app.post('/combo', async (req, res) => {
  const { color, selected } = req.body;

  if (!color || !selected) {
    return res.status(400).json({ error: 'Color and selected combo are required' });
  }

  let total = 0;
  let validatedCombo = {};

  for (const [category, productId] of Object.entries(selected)) {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ error: `Invalid product ID for ${category}` });
    }

    if (product.category !== category) {
      return res.status(400).json({ error: `Product category mismatch for ${category}` });
    }

    if (product.color !== color.toLowerCase()) {
      return res.status(400).json({ error: `Color mismatch for ${category}` });
    }

    validatedCombo[category] = {
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      affiliateUrl: product.affiliateUrl,
      title: product.title,
      asin: product.asin
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
