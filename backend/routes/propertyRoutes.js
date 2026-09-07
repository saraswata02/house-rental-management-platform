const express = require('express');
const router = express.Router();
const {
    getAllProperties, getPropertyById, getMyProperties,
    createProperty, updateProperty, deleteProperty
} = require('../controllers/propertyController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllProperties);

// Protected landlord routes (must be before /:id to avoid route conflict)
router.get('/owner/mine', protect, landlordOnly, getMyProperties);
router.post('/', protect, landlordOnly, upload.array('images', 10), createProperty);

// Routes with ID
router.get('/:id', getPropertyById);
router.put('/:id', protect, landlordOnly, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, landlordOnly, deleteProperty);

module.exports = router;
