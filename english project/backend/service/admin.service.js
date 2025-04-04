const Admin = require('../models/admin.model');  // Admin modeli

class AdminService {
    // Adminni yaratish
    async createAdmin(name, password) {
        const existingAdmin = await Admin.isAdminExist();
        if (existingAdmin) {
            throw new Error('Admin allaqachon mavjud');
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Parolni hash qilish
        const admin = new Admin({ name, password: hashedPassword });

        await admin.save(); // Adminni saqlash
        return admin;
    }

    // Adminni login qilish
    async login(name, password) {
        const admin = await Admin.findOne({ name });
        if (!admin) {
            throw new Error('Admin topilmadi');
        }

        const isMatch = await bcrypt.compare(password, admin.password);  // Parolni tekshirish
        if (!isMatch) {
            throw new Error('Parol xato');
        }

        const refreshToken = generateRefreshToken(admin._id);  // Refresh token yaratish (bu funksiya alohida yozilishi kerak)
        return { admin, refreshToken };
    }

    // Logout qilish
    async logout(refreshToken) {
        // Refresh tokenni o'chirish
        await deleteRefreshToken(refreshToken);  // Refresh tokenni yo'q qilish (funksiya alohida yozilishi kerak)
    }

    // Adminning profilini olish
    async getProfile(adminId) {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new Error('Admin topilmadi');
        }
        return admin;
    }
}

module.exports = new AdminService();
