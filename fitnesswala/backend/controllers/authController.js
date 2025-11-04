
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

// ✅ Cookie configuration
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

// ✅ REGISTER CONTROLLER
export const registerUser = async (req, res) => {
  try {
    console.log('📝 Register request received:', { name: req.body.name, email: req.body.email });
    
    const { name, email, password, currency } = req.body;

    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      currency: currency || 'USD',
    });

    await user.save();
    console.log('✅ User created successfully:', user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set cookie (for browsers that support it)
    const cookieOptions = getCookieOptions();
    res.cookie('token', token, cookieOptions);
    console.log('🍪 Cookie set with options:', cookieOptions);

    // ✅ Also return token in response body (for Authorization header)
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency },
      token, // ✅ Send token in response
    });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN CONTROLLER
export const loginUser = async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set cookie (for browsers that support it)
    const cookieOptions = getCookieOptions();
    res.cookie('token', token, cookieOptions);
    console.log('🍪 Cookie set for user:', user._id, 'Options:', cookieOptions);

    // ✅ Also return token in response body (for Authorization header)
    res.json({
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency },
      token, // ✅ Send token in response
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    console.log('🔍 Getting current user:', req.userId);
    
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Current user fetched:', user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (err) {
    console.error('❌ Get current user error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGOUT CONTROLLER
export const logoutUser = (req, res) => {
  try {
    console.log('🚪 Logout request received for user:', req.userId);
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    
    console.log('✅ Cookie cleared successfully');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('❌ Logout error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
