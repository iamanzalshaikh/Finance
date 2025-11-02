// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    console.log('🔐 Auth middleware executing...');
    console.log('🍪 All cookies:', req.cookies);
    console.log('📋 Headers:', req.headers);
    
    // ✅ Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      console.log('❌ No token found in cookies');
      console.log('🍪 Available cookies:', Object.keys(req.cookies));
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('✅ Token found in cookies:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    console.log('✅ Token verified for user:', req.userId);
    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    console.log('🔍 Token verification failed');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
