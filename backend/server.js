const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Allowed origins (Render + local dev)
const allowedOrigins = [
  'https://dvepo-2.onrender.com', // ✅ your deployed frontend/backend
  'http://localhost:3000',        // ✅ local dev
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl / mobile apps
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('❌ CORS not allowed'));
      }
    },
    credentials: true, // ✅ critical: allows cookies
  })
);

// ✅ Security & logging
app.use(helmet());
app.use(morgan('dev'));

// ✅ Core middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Mongoose v6+
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

// ✅ API Routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ✅ Serve React frontend (build folder)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  // Dev root test
  app.get('/', (req, res) => {
    res.send('🚀 API is running in development mode...');
  });
}

// ✅ 404 handler (only for API, React handled above)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ error: '❌ API route not found' });
  } else {
    next();
  }
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack || err.message || err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ✅ Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed');
  process.exit(0);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
