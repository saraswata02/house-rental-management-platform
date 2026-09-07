const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    property:       { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    visitDate:      { type: String, required: true },   // e.g. "18 July 2026"
    timeSlot:       { type: String, required: true },   // e.g. "11:00 AM"
    purpose:        { type: String, default: 'House Inspection' },
    additionalNote: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
        default: 'pending'
    },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
