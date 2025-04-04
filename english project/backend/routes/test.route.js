const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');  // Auth middleware'ni import qilish
const TestController = require('../controllers/test.controller');  // Test controller'ni import qilish

// Faqat adminlar uchun test qo'shish
router.post('/create', authMiddleware, TestController.createTest);
// Testni tahrirlash (faqat admin uchun)
router.put('/update/:id', authMiddleware, TestController.updateTest);

// Testni o'chirish (faqat admin uchun)
router.delete('/delete/:id', authMiddleware, TestController.deleteTest);

module.exports = router;