const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = require('./routes/authenticateToken'); // 

const app = express();
app.use(express.json());
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).send("Protected content");
});

describe('Authentication Middleware', () => {
  it('should deny access if no token is provided', async () => {
    await request(app)
      .get('/protected')
      .expect(401);
  });

  it('should deny access if token is invalid', async () => {
    await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer wrongtoken')
      .expect(403);
  });

  it('should allow access if token is valid', async () => {
    const token = jwt.sign({ username: 'testuser' }, process.env.JWT_SECRET);
    await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
