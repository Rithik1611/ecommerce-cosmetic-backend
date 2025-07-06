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
    { type: 'lipstick', brand: 'MAC', color: 'red', price: 999 },
    { type: 'lipstick', brand: 'Huda Beauty', color: 'red', price: 1199 },
    { type: 'lipstick', brand: 'Maybelline', color: 'red', price: 699 },

    { type: 'gloss', brand: 'Fenty', color: 'red', price: 1099 },
    { type: 'gloss', brand: 'Nyx', color: 'red', price: 499 },

    { type: 'liner', brand: 'Lakme', color: 'red', price: 399 },
    { type: 'liner', brand: 'Colorbar', color: 'red', price: 499 },

    { type: 'tint', brand: 'Etude', color: 'red', price: 599 },
    { type: 'tint', brand: 'Benefit', color: 'red', price: 799 },

    
    { type: 'lipstick', brand: 'Loreal', color: 'pink', price: 899 },
    { type: 'gloss', brand: 'Nyx', color: 'pink', price: 499 },
    { type: 'liner', brand: 'Faces', color: 'pink', price: 399 },
    { type: 'tint', brand: 'Benefit', color: 'pink', price: 699 }
  ]);

  console.log('✅ Seed completed');
  process.exit();
})
.catch(err => console.error(err));
