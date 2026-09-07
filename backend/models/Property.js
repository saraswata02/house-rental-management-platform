const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location:    { type: String, required: true },
    rent:        { type: Number, required: true },
    bhk:         { type: String, enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'], required: true },
    propertyType:{ type: String, default: 'Apartment' },
    images:      [{ type: String }], // URLs (Cloudinary or /uploads/ paths)
    lat:         { type: Number, default: 20.2961 },
    lng:         { type: Number, default: 85.8245 },
    amenities:   [{ type: String }], // e.g. ['Parking', 'Lift', 'WiFi']
    bathrooms:   { type: Number, default: 1 },
    availabilityStatus: {
        type: String,
        enum: ['available', 'occupied'],
        default: 'available'
    },
    landlord:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating:      { type: Number, default: 4.5, min: 0, max: 5 },
    views:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
