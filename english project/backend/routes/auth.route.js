const AuthController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router.post('/register',AuthController.register)
router.get('/activate/:id',AuthController.activation)
router.post('/login',AuthController.login)
router.post('/logout',AuthController.logout)
router.get('/get-profile/:id',AuthController.getProfile)
router.put('/update-skill/:id',AuthController.updateSkills)
router.get('/get-all',AuthController.getAll)
router.put("/edit/:id",AuthController.edit)
router.post("/logout", AuthController.logout);
module.exports = router