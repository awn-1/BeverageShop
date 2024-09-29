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

// Protect all routes
app.use(jwtCheck);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});