const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with a real DB like MongoDB/PostgreSQL in production)
const db = {
  users: [],
  tasks: []
};

// Seed a demo user
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
db.users.push({
  id: uuidv4(),
  username: 'demo',
  email: 'demo@example.com',
  password: bcrypt.hashSync('password123', salt),
  createdAt: new Date().toISOString()
});

module.exports = db;
