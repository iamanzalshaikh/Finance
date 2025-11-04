

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    console.log('🔐 Auth middleware executing...');
    console.log('🍪 Cookies:', req.cookies);
    console.log('📋 Authorization header:', req.headers.authorization);
    
    // ✅ Try to get token from cookie first, then from Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      // Extract token from "Bearer <token>" format
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('✅ Token found in Authorization header');
      }
    } else if (token) {
      console.log('✅ Token found in cookies');
    }
    
    if (!token) {
      console.log('❌ No token found in cookies or Authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }
    
    console.log('🔍 Token preview:', token.substring(0, 20) + '...');
    
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
