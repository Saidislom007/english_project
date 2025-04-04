const Test = require('../models/test.model');  // Test modelini import qilish

class TestController {
    // Test qo'shish (faqat adminlar uchun)
    async createTest(req, res, next) {
        try {
            const { type, title, questions } = req.body;

            // Test yaratish
            const test = new Test({
                type,
                title,
                questions,
            });

            await test.save();  // Testni saqlash

            return res.status(201).json({ message: 'Test muvaffaqiyatli yaratildi', test });
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }
    async updateTest(req, res, next) {
        try {
            const testId = req.params.id;  // Tahrirlanadigan testni ID'sini olish
            const { type, title, questions } = req.body;  // Yangi malumotlarni olish

            // Testni yangilash
            const updatedTest = await Test.findByIdAndUpdate(testId, { type, title, questions }, { new: true });

            if (!updatedTest) {
                return res.status(404).json({ message: 'Test topilmadi' });
            }

            return res.json({ message: 'Test muvaffaqiyatli tahrirlandi', updatedTest });
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }

    // Testni o'chirish
    async deleteTest(req, res, next) {
        try {
            const testId = req.params.id;  // O'chiriladigan testning ID'sini olish

            // Testni o'chirish
            const deletedTest = await Test.findByIdAndDelete(testId);

            if (!deletedTest) {
                return res.status(404).json({ message: 'Test topilmadi' });
            }

            return res.json({ message: 'Test muvaffaqiyatli o\'chirildi', deletedTest });
        } catch (error) {
            next(error);  // Xatolikni middleware'ga yuborish
        }
    }

}

module.exports = new TestController();