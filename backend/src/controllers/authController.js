const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const isValidUser = username === process.env.ADMIN_USERNAME;
    const isValidPass = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10))
      || password === process.env.ADMIN_PASSWORD;

    if (!isValidUser || !isValidPass) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ username, role: 'admin' });
    res.json({ token, username, role: 'admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verify = (req, res) => {
  res.json({ valid: true, admin: req.admin });
};
