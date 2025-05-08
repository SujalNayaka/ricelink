const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tarun@!%$(}<>#+-*/&%'; // Use env vars in production

const verify = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    console.log('[AUTH] No token found in cookies');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // console.log('[AUTH] Token verified successfully:', decoded);
    next();
  } catch (err) {
    console.error('[AUTH] Invalid token', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verify;
