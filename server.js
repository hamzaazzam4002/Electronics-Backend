require('dotenv').config(); // تحميل متغيرات البيئة من ملف .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerSetup = require('./config/swagger');


// استيراد المتحكمات
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');
const electronicPartRoutes = require('./routes/electronicPartRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const accessoryRoutes = require('./routes/accessoryRoutes');
const repairRoutes = require('./routes/repairRoutes');

const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // السماح بجميع المصادر (أي domain)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // السماح بجميع الطرق
    allowedHeaders: ['Content-Type', 'Authorization'], // السماح بجميع الهيدرات
  }));
swaggerSetup(app);

// حماية جميع المسارات باستخدام verifyToken
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', authController.verifyToken);

// المسارات
app.use('/api/parts', electronicPartRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/api/repairs', repairRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
