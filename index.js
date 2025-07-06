const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Helper: Generate token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// POST /register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
  if (existingUser) {
    return res.status(400).json({ error: 'Username or email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword
  });

  await user.save();

  const token = generateToken(user);

  res.json({
    message: 'User registered successfully',
    token
  });
});

// POST /login
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/email and password required' });
  }

  const user = await User.findOne({
    $or: [
      { username: usernameOrEmail },
      { email: usernameOrEmail }
    ]
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);

  res.json({
    message: 'Login successful',
    token
  });
});

// GET /profile (protected)
app.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});


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
