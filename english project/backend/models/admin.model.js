const { Schema, model } = require('mongoose');


const AdminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Adminning nomi bir xil bo'lmasligi kerak
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Adminni faqat bitta yaratish uchun tekshirish
AdminSchema.statics.isAdminExist = async function () {
    const admin = await this.findOne(); // Agar admin mavjud bo'lsa, qaytaradi
    return admin;
};

// Adminni yaratish uchun static metod
AdminSchema.statics.createAdmin = async function (name, password) {
    // Agar admin mavjud bo'lsa, uni qaytaradi
    const existingAdmin = await this.isAdminExist();
    if (existingAdmin) {
        throw new Error('Admin allaqachon mavjud');
    }

    // Yangi admin yaratish (parolni oddiy matn sifatida saqlash)
    const admin = new this({ name, password });
    await admin.save();
    return admin;
};
const Admin = model('Admin', AdminSchema);
module.exports = Admin