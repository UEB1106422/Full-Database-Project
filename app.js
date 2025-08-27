const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, testConnection } = require('./db');
require('dotenv').config();

const app = express();

// Manual CORS headers as backup
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Debugging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// CORS configuration - allow requests from your frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'], 
  credentials: true
}));
app.use(express.json());

// Test endpoint to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Register endpoint with enhanced duplicate checking
app.post('/api/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { first_name, last_name, email, password } = req.body;
    
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check minimum password length
    if (password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      console.log('Registration attempt with existing email:', email);
      return res.status(400).json({ error: 'User already exists with this email address. Please login instead.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [first_name, last_name, email, hashedPassword]
    );
    
    console.log('Registration successful for:', email);
    // Don't auto-login after registration, just confirm success
    res.json({ message: 'Registration successful! Please login with your credentials.' });
    
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === '23505') { // Unique violation (backup check)
      return res.status(400).json({ error: 'User already exists with this email address. Please login instead.' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    console.log('Login successful for:', email);
    res.json({ token, message: 'Login successful', user: { first_name: user.first_name, last_name: user.last_name, email: user.email } });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// View applications endpoint (protected)
app.get('/api/applications', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Application endpoint (protected) with enhanced validation
app.post('/api/applications', authenticate, async (req, res) => {
  try {
    console.log('Application submission received:', req.body);
    const { first_name, last_name, email, phone, dob, program, previous_education, personal_statement } = req.body;
    
    if (!first_name || !last_name || !email || !phone || !dob || !program || !previous_education || !personal_statement) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate date of birth (must be before 2011)
    const birthDate = new Date(dob);
    const maxDate = new Date('2010-12-31');
    
    if (birthDate > maxDate) {
      return res.status(400).json({ error: 'Date of birth must be before 2011' });
    }

    // Check if user already has an application for this program
    const existingApp = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND program = $2',
      [req.userId, program]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ error: 'You have already submitted an application for this program' });
    }
    
    await pool.query(
      'INSERT INTO applications (user_id, first_name, last_name, email, phone, dob, program, previous_education, personal_statement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [req.userId, first_name, last_name, email, phone, dob, program, previous_education, personal_statement]
    );
    
    console.log('Application submitted successfully for:', email);
    res.json({ message: 'Application submitted successfully' });
    
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ error: 'Server error during application submission' });
  }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Contact form submission received:', req.body);
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    await pool.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    
    console.log('Contact message saved for:', email);
    res.json({ message: 'Your message has been sent successfully' });
    
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Server error while sending message' });
  }
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    console.log('Newsletter subscription received:', req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    await pool.query('INSERT INTO newsletter (email) VALUES ($1)', [email]);
    
    console.log('Newsletter subscription saved for:', email);
    res.json({ message: 'Successfully subscribed to newsletter' });
    
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Server error during subscription' });
  }
});

// Test database connection on startup
testConnection().then((isConnected) => {
  if (!isConnected) {
    console.error('Failed to connect to database. Server will start but database operations will fail.');
  }
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!isConnected) {
      console.log('NOTE: Database connection failed. Please check your PostgreSQL configuration.');
    }
  });
});