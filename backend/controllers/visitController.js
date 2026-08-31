const Visit = require('../models/Visit');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Book a new visit
// @route   POST /api/visits
// @access  Private (Tenant)
const bookVisit = async (req, res) => {
    try {
        const { propertyId, visitDate, timeSlot, purpose, additionalNote } = req.body;

        const property = await Property.findById(propertyId).populate('landlord');
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const visit = await Visit.create({
            property: propertyId,
            tenant: req.user._id,
            visitDate,
            timeSlot,
            purpose: purpose || 'House Inspection',
            additionalNote: additionalNote || '',
        });

        // Notify the landlord
        await Notification.create({
            user: property.landlord._id,
            icon: '📅',
            title: 'New Appointment',
            message: `${req.user.firstName} ${req.user.lastName} booked a visit for ${property.title}.`,
        });

        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tenant's own visits (My Appointments page)
// @route   GET /api/visits/my-visits
// @access  Private (Tenant)
const getMyVisits = async (req, res) => {
    try {
        const visits = await Visit.find({ tenant: req.user._id })
            .populate('property', 'title location images rent')
            .sort({ createdAt: -1 });
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all visits for owner's properties (Owner Appointments page)
// @route   GET /api/visits/for-owner
// @access  Private (Landlord)
const getVisitsForOwner = async (req, res) => {
    try {
        const myProperties = await Property.find({ landlord: req.user._id }).select('_id');
        const propertyIds = myProperties.map(p => p._id);

        const visits = await Visit.find({ property: { $in: propertyIds } })
            .populate('tenant', 'firstName lastName email phone profilePicture')
            .populate('property', 'title location rent bhk')
            .sort({ createdAt: -1 });

        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single visit by ID
// @route   GET /api/visits/:id
// @access  Private
const getVisitById = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('tenant', 'firstName lastName email phone profilePicture')
            .populate('property', 'title location rent bhk images');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });
        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update visit status (approve/reject/complete)
// @route   PATCH /api/visits/:id/status
// @access  Private (Landlord)
const updateVisitStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' | 'rejected' | 'completed'
        const allowedStatuses = ['approved', 'rejected', 'completed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
        }

        const visit = await Visit.findById(req.params.id).populate('property').populate('tenant');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        // Security: Ensure the landlord owns the property for this visit
        if (visit.property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this visit' });
        }

        visit.status = status;
        await visit.save();

        // Notify tenant
        const iconMap = { approved: '✅', rejected: '❌', completed: '🏠' };
        const titleMap = { approved: 'Appointment Approved', rejected: 'Appointment Rejected', completed: 'Visit Completed' };
        await Notification.create({
            user: visit.tenant._id,
            icon: iconMap[status] || '🔔',
            title: titleMap[status],
            message: `Your visit to ${visit.property.title} on ${visit.visitDate} has been ${status}.`,
        });

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reschedule a visit
// @route   PATCH /api/visits/:id/reschedule
// @access  Private (Landlord)
const rescheduleVisit = async (req, res) => {
    try {
        const { visitDate, timeSlot } = req.body;
        const visit = await Visit.findById(req.params.id).populate('tenant').populate('property');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        // Security: Ensure the landlord owns the property for this visit
        if (visit.property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to reschedule this visit' });
        }

        visit.visitDate = visitDate;
        visit.timeSlot = timeSlot;
        visit.status = 'pending';
        await visit.save();

        // Notify tenant
        await Notification.create({
            user: visit.tenant._id,
            icon: '📅',
            title: 'Visit Rescheduled',
            message: `Your visit to ${visit.property.title} has been rescheduled to ${visitDate} at ${timeSlot}.`,
        });

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a visit (tenant)
// @route   PATCH /api/visits/:id/cancel
// @access  Private (Tenant)
const cancelVisit = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id).populate({
            path: 'property',
            populate: { path: 'landlord', select: '_id firstName lastName' }
        });
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        if (visit.tenant.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        visit.status = 'cancelled';
        await visit.save();

        // Notify the landlord about the cancellation
        if (visit.property?.landlord?._id) {
            await Notification.create({
                user: visit.property.landlord._id,
                icon: '❌',
                title: 'Appointment Cancelled',
                message: `${req.user.firstName} ${req.user.lastName} has cancelled their visit to ${visit.property.title} on ${visit.visitDate}.`,
            });
        }

        res.json({ message: 'Visit cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookVisit, getMyVisits, getVisitsForOwner, getVisitById, updateVisitStatus, rescheduleVisit, cancelVisit };
