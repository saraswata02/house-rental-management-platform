const express = require('express');
const router = express.Router();
const {
    bookVisit, getMyVisits, getVisitsForOwner,
    getVisitById, updateVisitStatus, requestReschedule,
    selectAlternateDate, rescheduleVisit, cancelVisit
} = require('../controllers/visitController');
const { protect, tenantOnly, landlordOnly } = require('../middleware/authMiddleware');

router.post('/', protect, tenantOnly, bookVisit);
router.get('/my-visits', protect, tenantOnly, getMyVisits);
router.get('/for-owner', protect, landlordOnly, getVisitsForOwner);
router.get('/:id', protect, getVisitById);
router.patch('/:id/status', protect, landlordOnly, updateVisitStatus);
router.patch('/:id/reschedule-request', protect, landlordOnly, requestReschedule);
router.patch('/:id/select-date', protect, tenantOnly, selectAlternateDate);
router.patch('/:id/reschedule', protect, landlordOnly, rescheduleVisit);
router.patch('/:id/cancel', protect, tenantOnly, cancelVisit);

module.exports = router;
