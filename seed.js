const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Seeding data...');

  await Product.deleteMany({}); 

  await Product.insertMany([
    { category: 'lipstick', brand: 'MAC', color: 'red', price: 999, imageUrl: 'https://example.com/mac-red.jpg', affiliateUrl: 'https://aff.example.com/mac-red', title: 'MAC Red Lipstick', asin: 'B000MACRED' },
    { category: 'lipstick', brand: 'Huda Beauty', color: 'red', price: 1199, imageUrl: 'https://example.com/huda-red.jpg', affiliateUrl: 'https://aff.example.com/huda-red', title: 'Huda Beauty Red Lipstick', asin: 'B000HUDARED' },
    { category: 'lipstick', brand: 'Maybelline', color: 'red', price: 699, imageUrl: 'https://example.com/maybelline-red.jpg', affiliateUrl: 'https://aff.example.com/maybelline-red', title: 'Maybelline Red Lipstick', asin: 'B000MAYRED' },

    { category: 'gloss', brand: 'Fenty', color: 'red', price: 1099, imageUrl: 'https://example.com/fenty-red.jpg', affiliateUrl: 'https://aff.example.com/fenty-red', title: 'Fenty Red Gloss', asin: 'B000FENTYRED' },
    { category: 'gloss', brand: 'Nyx', color: 'red', price: 499, imageUrl: 'https://example.com/nyx-red-gloss.jpg', affiliateUrl: 'https://aff.example.com/nyx-red-gloss', title: 'Nyx Red Gloss', asin: 'B000NYXRED' },

    { category: 'liner', brand: 'Lakme', color: 'red', price: 399, imageUrl: 'https://example.com/lakme-red-liner.jpg', affiliateUrl: 'https://aff.example.com/lakme-red-liner', title: 'Lakme Red Liner', asin: 'B000LAKMERED' },
    { category: 'liner', brand: 'Colorbar', color: 'red', price: 499, imageUrl: 'https://example.com/colorbar-red-liner.jpg', affiliateUrl: 'https://aff.example.com/colorbar-red-liner', title: 'Colorbar Red Liner', asin: 'B000COLORRED' },

    { category: 'tint', brand: 'Etude', color: 'red', price: 599, imageUrl: 'https://example.com/etude-red-tint.jpg', affiliateUrl: 'https://aff.example.com/etude-red-tint', title: 'Etude Red Tint', asin: 'B000ETUDERED' },
    { category: 'tint', brand: 'Benefit', color: 'red', price: 799, imageUrl: 'https://example.com/benefit-red-tint.jpg', affiliateUrl: 'https://aff.example.com/benefit-red-tint', title: 'Benefit Red Tint', asin: 'B000BENEFITRED' },

    { category: 'lipstick', brand: 'Loreal', color: 'pink', price: 899, imageUrl: 'https://example.com/loreal-pink.jpg', affiliateUrl: 'https://aff.example.com/loreal-pink', title: 'Loreal Pink Lipstick', asin: 'B000LOREALPINK' },
    { category: 'gloss', brand: 'Nyx', color: 'pink', price: 499, imageUrl: 'https://example.com/nyx-pink-gloss.jpg', affiliateUrl: 'https://aff.example.com/nyx-pink-gloss', title: 'Nyx Pink Gloss', asin: 'B000NYXPINK' },
    { category: 'liner', brand: 'Faces', color: 'pink', price: 399, imageUrl: 'https://example.com/faces-pink-liner.jpg', affiliateUrl: 'https://aff.example.com/faces-pink-liner', title: 'Faces Pink Liner', asin: 'B000FACESPNK' },
    { category: 'tint', brand: 'Benefit', color: 'pink', price: 699, imageUrl: 'https://example.com/benefit-pink-tint.jpg', affiliateUrl: 'https://aff.example.com/benefit-pink-tint', title: 'Benefit Pink Tint', asin: 'B000BENEFITPNK' }
  ]);

  console.log('✅ Seed completed');
  process.exit();
})
.catch(err => console.error(err));
