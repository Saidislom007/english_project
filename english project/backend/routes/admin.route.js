const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');  // Admin Controller import qilish

// Adminni yaratish (faqat bitta admin)
router.post('/create', AdminController.createAdmin);

// Adminni login qilish
router.post('/login', AdminController.login);

// Adminni logout qilish
router.post('/logout', AdminController.logout);

// Adminning profilini olish
router.get('/profile/:id', AdminController.getProfile);

module.exports = router;
