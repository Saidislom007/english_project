const AdminService = require('../service/admin.service');  // Admin bilan bog'liq biznes logikasini bajaruvchi service

class AdminController {
  
    // Admin yaratish
    async createAdmin(req, res, next) {
        try {
            const { name, password } = req.body;
            const adminData = await AdminService.createAdmin(name, password); // Adminni yaratish

            res.status(201).json({ message: 'Admin yaratildi', admin: adminData });
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }

    // Adminni login qilish
    async login(req, res, next) {
        try {
            const { name, password } = req.body;
            const adminData = await AdminService.login(name, password); // Adminni tekshirish va login qilish

            res.cookie('refreshToken', adminData.refreshToken, { 
                httpOnly: true, 
                maxAge: 30 * 24 * 60 * 60 * 1000  // 30 kunlik token
            });

            return res.json({ message: 'Admin tizimga kirdi', admin: adminData });
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }

    // Adminni logout qilish
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(400).json({ message: 'No refresh token provided' });
            }

            await AdminService.logout(refreshToken);  // Tokenni o'chirish

            res.clearCookie('refreshToken');  // Cookie'ni tozalash

            return res.json({ message: 'Admin muvaffaqiyatli chiqdi' });
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }

    // Admin profili haqida ma'lumot olish
    async getProfile(req, res, next) {
        try {
            const adminId = req.params.id;  // Admin ID'si

            const admin = await AdminService.getProfile(adminId);

            if (!admin) {
                return res.status(404).json({ message: 'Admin topilmadi' });
            }

            res.json(admin);  // Adminning ma'lumotlarini qaytarish
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }
}

module.exports = new AdminController();
