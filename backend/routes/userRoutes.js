const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, addToWishlist, removeFromWishlist, getPublicProfile, uploadProfilePicture } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.post('/wishlist/:propertyId', protect, addToWishlist);
router.delete('/wishlist/:propertyId', protect, removeFromWishlist);
// Public — must be LAST to avoid matching /profile or /wishlist as :userId
router.get('/:userId', getPublicProfile);

module.exports = router;
