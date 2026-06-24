require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

async function createAdmin() {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@water.com' });

  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@water.com',
    password: 'password123',
    role: 'admin',
    verified: true
  });

  console.log('Admin created successfully');
  process.exit(0);
}

createAdmin().catch(console.error);