require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

/* -------------------------------------------------------------------------- */
/*                               Allowed Origins                              */
/* -------------------------------------------------------------------------- */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://reactwatercreditsystem.vercel.app' // replace with your exact Vercel URL
];

/* -------------------------------------------------------------------------- */
/*                                Socket.io                                   */
/* -------------------------------------------------------------------------- */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

/* -------------------------------------------------------------------------- */
/*                         Socket.io JWT Middleware                            */
/* -------------------------------------------------------------------------- */

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

/* -------------------------------------------------------------------------- */
/*                             Socket Connection                              */
/* -------------------------------------------------------------------------- */

io.on('connection', (socket) => {
  const user = socket.user;

  console.log(`[WS] Connected: ${user.name} (${user.role})`);

  socket.join(`user:${user._id}`);

  if (user.role === 'transporter') {
    socket.join('transporters');
  }

  if (user.role === 'admin') {
    socket.join('admins');
  }

  socket.on('track_order', (orderId) => {
    socket.join(`order:${orderId}`);
  });

  socket.on('untrack_order', (orderId) => {
    socket.leave(`order:${orderId}`);
  });

  socket.on('location_update', async ({ lat, lng }) => {
    try {
      await User.findByIdAndUpdate(user._id, {
        liveLocation: {
          lat,
          lng,
          updatedAt: new Date(),
        },
      });

      io.to('admins').emit('transporter_location', {
        transporterId: user._id,
        name: user.name,
        lat,
        lng,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`[WS] Disconnected: ${user.name} (${reason})`);
  });
});

/* -------------------------------------------------------------------------- */
/*                            Attach io to requests                           */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
  req.io = io;
  next();
});

/* -------------------------------------------------------------------------- */
/*                              Express Middleware                            */
/* -------------------------------------------------------------------------- */

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/transporter', require('./routes/transporterRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

/* -------------------------------------------------------------------------- */
/*                              Health Endpoint                               */
/* -------------------------------------------------------------------------- */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    websocket: 'enabled',
    time: new Date(),
  });
});

/* -------------------------------------------------------------------------- */
/*                                404 Handler                                 */
/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

/* -------------------------------------------------------------------------- */
/*                            Global Error Handler                            */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

/* -------------------------------------------------------------------------- */
/*                             Start Application                              */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`🚀 AquaFlow V2 running on port ${PORT}`);
  console.log('🔌 WebSocket server enabled');

  try {
    await connectDB();
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
});