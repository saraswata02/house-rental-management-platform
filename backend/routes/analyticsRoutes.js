const express = require('express');
const router = express.Router();
const { getOwnerAnalytics, getSystemStats } = require('../controllers/analyticsController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');

// Public — used by QuickStats on tenant dashboard
router.get('/system-stats', getSystemStats);

// Private — owner analytics page
router.get('/owner', protect, landlordOnly, getOwnerAnalytics);

module.exports = router;
