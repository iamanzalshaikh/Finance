// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import User from '../models/User.js';

// // ✅ REGISTER CONTROLLER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, currency } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // ✅ Hash password before saving (moved from model)
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       currency: currency || 'USD',
//     });

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(201).json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ LOGIN CONTROLLER
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Missing email or password' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     // ✅ Compare password manually here
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         currency: user.currency,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import User from '../models/User.js';

// // ✅ REGISTER CONTROLLER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, currency } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       currency: currency || 'USD',
//     });

//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     // ✅ Send token as HTTP-only cookie
//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       })
//       .status(201)
//       .json({
//         user: { id: user._id, name: user.name, email: user.email },
//       });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ✅ LOGIN CONTROLLER
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Missing email or password' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     // ✅ Send token in secure cookie
//     res
//       .cookie('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .json({
//         user: { id: user._id, name: user.name, email: user.email },
//       });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ✅ LOGOUT CONTROLLER
// export const logoutUser = async (req, res) => {
//   try {
//     res
//       .cookie('token', '', {
//         httpOnly: true,
//         expires: new Date(0),
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         secure: process.env.NODE_ENV === 'production',
//       })
//       .status(200)
//       .json({ message: 'Logged out successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // ✅ GET CURRENT USER
// export const getCurrentUser = async (req, res) => {
//   try {
//     // Token verification (from cookie)
//     const token = req.cookies?.token;
//     if (!token) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-password');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         currency: user.currency,
//       },
//     });
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };



import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

// ✅ Cookie configuration for production and local
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true, // ✅ Prevents JavaScript access (XSS protection)
    secure: isProduction, // ✅ HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // ✅ 'none' for cross-origin in production, 'lax' for local
    maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days in milliseconds
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

    // ✅ Hash password before saving
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

    // ✅ Set cookie with token
    const cookieOptions = getCookieOptions();
    res.cookie('token', token, cookieOptions);
    console.log('🍪 Cookie set with options:', cookieOptions);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency },
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

    // ✅ Compare password manually
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set cookie with token
    const cookieOptions = getCookieOptions();
    res.cookie('token', token, cookieOptions);
    console.log('🍪 Cookie set for user:', user._id, 'Options:', cookieOptions);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency },
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
    
    // ✅ Clear the cookie
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
