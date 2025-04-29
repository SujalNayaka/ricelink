const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tarun@!%$(}<>#+-*/&%'; // replace with your actual secret

const verify = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // console.log('Token verified successfully:', decoded);
    next();
  } catch (err) {

    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verify;
