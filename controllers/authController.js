const User = require('../models/User');
const jwt = require('jsonwebtoken');

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();

    // إنشاء رمز مميز تلقائيًا بعد إنشاء الحساب
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token }); // إرجاع الرمز المميز
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // إنشاء رمز مميز (JWT)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// التحقق من الرمز المميز (JWT)
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Received token:', token); // فحص الرمز المميز المستلم

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // فحص الرمز المميز بعد فك التشفير
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Token verification error:', err); // فحص الأخطاء
    res.status(400).json({ error: 'Invalid token' });
  }
};