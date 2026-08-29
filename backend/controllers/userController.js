const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('wishlist');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { firstName, lastName, phone, dob, gender, role, address } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (dob) user.dob = dob;
        if (gender) user.gender = gender;
        if (role) user.role = role;
        if (address) user.address = { ...user.address, ...address };

        const updated = await user.save();
        res.json({
            _id: updated._id,
            userId: updated.userId,
            firstName: updated.firstName,
            lastName: updated.lastName,
            email: updated.email,
            phone: updated.phone,
            dob: updated.dob,
            gender: updated.gender,
            role: updated.role,
            address: updated.address,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add property to wishlist
// @route   POST /api/users/wishlist/:propertyId
// @access  Private (Tenant)
const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const propertyId = req.params.propertyId;

        if (!user.wishlist.includes(propertyId)) {
            user.wishlist.push(propertyId);
            await user.save();
        }
        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove property from wishlist
// @route   DELETE /api/users/wishlist/:propertyId
// @access  Private (Tenant)
const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.propertyId);
        await user.save();
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a specific user's public profile (name, avatar, role only)
// @route   GET /api/users/:userId
// @access  Public
const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('firstName lastName profilePicture role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload / update profile picture
// @route   POST /api/users/profile/picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();
        res.json({ profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile, addToWishlist, removeFromWishlist, getPublicProfile, uploadProfilePicture };
