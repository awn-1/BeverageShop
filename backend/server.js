const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3001; // Changed to 3001 as React will use 3000

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Simulated database
let products = [
  { id: 1, name: 'Product 1', price: 10, inventory: 100 },
  { id: 2, name: 'Product 2', price: 15, inventory: 100 },
  { id: 3, name: 'Product 3', price: 20, inventory: 100 }
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.json(req.session.cart);
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