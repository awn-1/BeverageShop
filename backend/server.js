const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true if using https
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

let products = [
  { id: 1, name: 'Product 1', price: 10, inventory: 100 },
  { id: 2, name: 'Product 2', price: 15, inventory: 100 },
  { id: 3, name: 'Product 3', price: 20, inventory: 100 }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('Cart:', req.session.cart);
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.json(req.session.cart);
});

app.post('/api/cart/add', (req, res) => {
  console.log('Session ID:', req.sessionID);
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.inventory < quantity) {
    return res.status(400).json({ message: 'Not enough inventory' });
  }
  
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  const cartItem = req.session.cart.find(item => item.productId === parseInt(productId));
  
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    req.session.cart.push({ productId: parseInt(productId), quantity, price: product.price, name: product.name });
  }
  
  product.inventory -= quantity;
  
  console.log('Updated cart:', req.session.cart);
  res.json(req.session.cart);
});

// ... (keep the update route as is)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});