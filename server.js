const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Check if the required environment variables are set
if (!process.env.AUTH0_AUDIENCE || !process.env.AUTH0_DOMAIN) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Protect the /api/cart endpoint
app.use('/api/cart', jwtCheck);

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  res.json({ items: [] }); // Placeholder response
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.inventory < quantity) {
    return res.status(400).json({ message: 'Not enough inventory' });
  }
  
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  const cartItem = req.session.cart.find(item => item.productId === productId);
  
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    req.session.cart.push({ productId, quantity, price: product.price, name: product.name });
  }
  
  product.inventory -= quantity;
  
  res.json(req.session.cart);
});

app.post('/api/cart/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!req.session.cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const cartItem = req.session.cart.find(item => item.productId === productId);
  
  if (!cartItem) {
    return res.status(404).json({ message: 'Product not in cart' });
  }
  
  const product = products.find(p => p.id === productId);
  const inventoryDifference = quantity - cartItem.quantity;
  
  if (product.inventory < inventoryDifference) {
    return res.status(400).json({ message: 'Not enough inventory' });
  }
  
  cartItem.quantity = quantity;
  product.inventory -= inventoryDifference;
  
  if (cartItem.quantity <= 0) {
    req.session.cart = req.session.cart.filter(item => item.productId !== productId);
  }
  
  res.json(req.session.cart);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});