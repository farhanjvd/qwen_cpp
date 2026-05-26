const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'nab-secret-key-change-in-production';

// In-memory database (replace with SQLite/PostgreSQL in production)
let users = [];
let assets = [
  {
    id: '1',
    title: 'Commercial Plaza - Blue Area',
    type: 'commercial',
    description: 'Prime commercial property in Blue Area, Islamabad.',
    size: '5000 sq ft',
    value: 150000000,
    latitude: 33.7294,
    longitude: 73.0638,
    address: 'Plot 123, Blue Area',
    city: 'Islamabad',
    images: [],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Residential House - DHA Phase 6',
    type: 'property',
    description: 'Luxury residential property in DHA Phase 6.',
    size: '1 Kanal',
    value: 85000000,
    latitude: 33.6844,
    longitude: 73.0479,
    address: 'House 456, Street 12',
    city: 'Islamabad',
    images: [],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let auctions = [];
let otps = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    phone,
    password: hashedPassword,
    role: 'user',
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  res.json({ success: true, userId: user.id });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified, phoneVerified: user.phoneVerified } });
});

app.post('/api/auth/send-otp', authMiddleware, (req, res) => {
  const { type } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otps.push({
    id: uuidv4(),
    userId: req.user.id,
    code,
    type,
    expiresAt: new Date(Date.now() + 300000).toISOString(),
    used: false,
  });
  console.log(`OTP for ${type}: ${code}`); // In production, send via email/SMS
  res.json({ success: true });
});

app.post('/api/auth/verify-otp', authMiddleware, (req, res) => {
  const { code, type } = req.body;
  const otp = otps.find(o => o.userId === req.user.id && o.code === code && o.type === type && !o.used && new Date(o.expiresAt) > new Date());
  if (!otp) return res.status(400).json({ error: 'Invalid OTP' });
  
  otp.used = true;
  const user = users.find(u => u.id === req.user.id);
  if (type === 'email') user.emailVerified = true;
  else user.phoneVerified = true;
  
  res.json({ success: true });
});

// Asset routes
app.get('/api/assets', (req, res) => {
  const published = req.query.published === 'true';
  const filtered = published ? assets.filter(a => a.published) : assets;
  res.json(filtered);
});

app.post('/api/assets', authMiddleware, adminMiddleware, upload.array('images'), (req, res) => {
  const { title, type, description, size, value, latitude, longitude, address, city, published } = req.body;
  const images = req.files?.map(f => `/uploads/${f.filename}`) || [];
  const asset = {
    id: uuidv4(),
    title,
    type,
    description,
    size,
    value: parseFloat(value),
    latitude: latitude ? parseFloat(latitude) : undefined,
    longitude: longitude ? parseFloat(longitude) : undefined,
    address,
    city,
    images,
    published: published === 'true',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  assets.push(asset);
  res.json(asset);
});

app.put('/api/assets/:id', authMiddleware, adminMiddleware, upload.array('images'), (req, res) => {
  const assetIndex = assets.findIndex(a => a.id === req.params.id);
  if (assetIndex === -1) return res.status(404).json({ error: 'Asset not found' });
  
  const { title, type, description, size, value, latitude, longitude, address, city, published } = req.body;
  const existingImages = assets[assetIndex].images;
  const newImages = req.files?.map(f => `/uploads/${f.filename}`) || [];
  
  assets[assetIndex] = {
    ...assets[assetIndex],
    title,
    type,
    description,
    size,
    value: parseFloat(value),
    latitude: latitude ? parseFloat(latitude) : undefined,
    longitude: longitude ? parseFloat(longitude) : undefined,
    address,
    city,
    images: [...existingImages, ...newImages],
    published: published === 'true',
    updatedAt: new Date().toISOString(),
  };
  res.json(assets[assetIndex]);
});

app.delete('/api/assets/:id', authMiddleware, adminMiddleware, (req, res) => {
  assets = assets.filter(a => a.id !== req.params.id);
  res.json({ success: true });
});

// Auction routes
app.get('/api/auctions', (req, res) => {
  res.json(auctions);
});

app.post('/api/auctions', authMiddleware, adminMiddleware, (req, res) => {
  const { assetId, startingPrice, startTime, endTime } = req.body;
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  
  const auction = {
    id: uuidv4(),
    assetId,
    asset,
    startingPrice: parseFloat(startingPrice),
    currentBid: parseFloat(startingPrice),
    startTime,
    endTime,
    status: new Date(startTime) > new Date() ? 'upcoming' : 'live',
    bids: [],
    createdAt: new Date().toISOString(),
  };
  auctions.push(auction);
  io.emit('auction:created', auction);
  res.json(auction);
});

app.post('/api/auctions/:id/bid', authMiddleware, (req, res) => {
  const { amount } = req.body;
  const auctionIndex = auctions.findIndex(a => a.id === req.params.id);
  if (auctionIndex === -1) return res.status(404).json({ error: 'Auction not found' });
  
  const auction = auctions[auctionIndex];
  if (new Date(auction.endTime) < new Date()) return res.status(400).json({ error: 'Auction ended' });
  if (amount <= auction.currentBid) return res.status(400).json({ error: 'Bid too low' });
  
  const user = users.find(u => u.id === req.user.id);
  if (!user?.emailVerified || !user?.phoneVerified) return res.status(400).json({ error: 'Verify account first' });
  
  const bid = {
    id: uuidv4(),
    auctionId: auction.id,
    userId: req.user.id,
    amount,
    timestamp: new Date().toISOString(),
    bidder: { id: user.id, name: user.name, email: user.email },
  };
  
  auction.bids.push(bid);
  auction.currentBid = amount;
  
  // Anti-sniping: extend by 2 minutes if bid in last 2 minutes
  const timeLeft = new Date(auction.endTime) - new Date();
  if (timeLeft < 120000) {
    auction.endTime = new Date(new Date(auction.endTime).getTime() + 120000).toISOString();
  }
  
  io.emit('auction:bid', { auctionId: auction.id, bid, currentBid: amount, endTime: auction.endTime });
  res.json({ success: true, bid });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join:auction', (auctionId) => {
    socket.join(`auction:${auctionId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
