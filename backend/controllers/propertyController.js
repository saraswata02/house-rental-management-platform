const Property = require('../models/Property');
const Notification = require('../models/Notification');
const path = require('path');

// @desc    Get all properties (with optional filters)
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
    try {
        const { location, bhk, minRent, maxRent, sort, availabilityStatus } = req.query;
        const filter = {};
        // If a specific availability filter is sent, use it; otherwise default to 'available'
        if (availabilityStatus) {
            filter.availabilityStatus = availabilityStatus;
        } else {
            filter.availabilityStatus = 'available';
        }

        if (location) filter.location = { $regex: location, $options: 'i' };
        if (bhk) filter.bhk = bhk;
        if (minRent || maxRent) {
            filter.rent = {};
            if (minRent) filter.rent.$gte = Number(minRent);
            if (maxRent) filter.rent.$lte = Number(maxRent);
        }

        let query = Property.find(filter).populate('landlord', 'firstName lastName email phone');

        if (sort === 'newest') query = query.sort({ createdAt: -1 });
        else if (sort === 'price_asc') query = query.sort({ rent: 1 });
        else if (sort === 'price_desc') query = query.sort({ rent: -1 });
        else if (sort === 'rating') query = query.sort({ rating: -1 });
        else query = query.sort({ createdAt: -1 });

        const properties = await query;
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single property by ID (increments views)
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('landlord', 'firstName lastName email phone profilePicture');

        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Increment view count
        property.views += 1;
        await property.save();

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get properties owned by the logged-in landlord
// @route   GET /api/properties/owner/mine
// @access  Private (Landlord)
const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ landlord: req.user._id }).sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Landlord)
const createProperty = async (req, res) => {
    try {
        const { title, description, location, rent, bhk, propertyType, amenities, lat, lng, bathrooms } = req.body;

        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const property = await Property.create({
            title,
            description,
            location,
            rent: Number(rent),
            bhk,
            propertyType: propertyType || 'Apartment',
            images,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
            lat: lat ? Number(lat) : 20.2961,
            lng: lng ? Number(lng) : 85.8245,
            bathrooms: bathrooms ? Number(bathrooms) : 1,
            landlord: req.user._id,
        });

        // Create notification for landlord
        await Notification.create({
            user: req.user._id,
            icon: '🏠',
            title: 'Property Listed',
            message: `${title} has been published successfully.`,
        });

        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Landlord)
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        const { title, description, location, rent, bhk, amenities, availabilityStatus } = req.body;
        if (title) property.title = title;
        if (description) property.description = description;
        if (location) property.location = location;
        if (rent) property.rent = Number(rent);
        if (bhk) property.bhk = bhk;
        if (amenities) property.amenities = Array.isArray(amenities) ? amenities : amenities.split(',');
        if (availabilityStatus) property.availabilityStatus = availabilityStatus;
        if (req.files && req.files.length > 0) {
            property.images = req.files.map(f => `/uploads/${f.filename}`);
        }

        const updated = await property.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Landlord)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        await property.deleteOne();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllProperties, getPropertyById, getMyProperties, createProperty, updateProperty, deleteProperty };
