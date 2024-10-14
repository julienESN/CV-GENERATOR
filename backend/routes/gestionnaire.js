/* eslint-disable no-undef */
const express = require('express');
const authenticateToken = require('../middleware/auth');
const cvController = require('../controllers/cvController');
const router = express.Router();

router.post('/cv/create', authenticateToken, cvController.createCv);

router.get('/cv/user', authenticateToken, cvController.getUserCvs);

router.put('/cv/update/:id', authenticateToken, cvController.updateCv);

router.get('/cv/public', authenticateToken, cvController.getPublicCvs);

router.get('/cv/:id', authenticateToken, cvController.getCvById);

module.exports = router;
