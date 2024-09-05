const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Auth0 authentication middleware
const jwtCheck = auth({
  audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
  issuerBaseURL: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Simulated database
let products = [
  { id: 1, name: 'Product 1', price: 10, inventory: 100 },
  { id: 2, name: 'Product 2', price: 15, inventory: 100 },
  { id: 3, name: 'Product 3', price: 20, inventory: 100 }
];

// Public route
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Protected routes
app.use(jwtCheck);

app.get('/api/cart', requiresAuth(), (req, res) => {
  const userId = req.oidc.user.sub;
  if (!carts[userId]) {
    carts[userId] = [];
  }
  res.json(carts[userId]);
});

app.post('/api/cart/add', requiresAuth(), (req, res) => {
  const userId = req.oidc.user.sub;
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.inventory < quantity) {
    return res.status(400).json({ message: 'Not enough inventory' });
  }
  
  if (!carts[userId]) {
    carts[userId] = [];
  }
  
  const cartItem = carts[userId].find(item => item.productId === productId);
  
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    carts[userId].push({ productId, quantity, price: product.price, name: product.name });
  }
  
  product.inventory -= quantity;
  
  res.json(carts[userId]);
});

app.post('/api/cart/update', requiresAuth(), (req, res) => {
  const userId = req.oidc.user.sub;
  const { productId, quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const cartItem = carts[userId].find(item => item.productId === productId);
  
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
    carts[userId] = carts[userId].filter(item => item.productId !== productId);
  }
  
  res.json(carts[userId]);
});

app.get('/api/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});