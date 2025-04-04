const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');  // Admin modelini import qilish

// Adminni autentifikatsiya qilish uchun middleware
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;  // Refresh tokenni cookie'dan olish

        if (!token) {
            return res.status(401).json({ message: 'Token mavjud emas' });
        }

        // Tokenni tekshirish
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // JWT tokenni dekodlash

        // Adminni topish
        const admin = await Admin.findById(decoded.adminId);
        if (!admin) {
            return res.status(401).json({ message: 'Admin topilmadi' });
        }

        req.admin = admin;  // Adminni request obyekti bilan yuborish
        next();  // Requestni keyingi middleware yoki controllerga yuborish
    } catch (error) {
        return res.status(401).json({ message: 'Tokenni tekshirishda xato' });
    }
};
