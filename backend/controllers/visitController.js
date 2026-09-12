const Visit = require('../models/Visit');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Book a new visit
// @route   POST /api/visits
// @access  Private (Tenant)
// @desc    Book a new visit
// @route   POST /api/visits
// @access  Private (Tenant)
const bookVisit = async (req, res) => {
    try {
        const propertyId = req.body.propertyId || req.body.property;
        const { visitDate, timeSlot, purpose, additionalNote } = req.body;

        const property = await Property.findById(propertyId).populate('landlord');
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const visit = await Visit.create({
            property: propertyId,
            tenant: req.user._id,
            visitDate,
            timeSlot: timeSlot || '11:00 AM',
            purpose: purpose || 'House Inspection',
            additionalNote: additionalNote || '',
        });

        // Notify the landlord
        await Notification.create({
            user: property.landlord._id,
            icon: '📅',
            title: 'New Appointment Request',
            message: `A tenant booked a visit for "${property.title}" on ${visitDate} at ${timeSlot || '11:00 AM'}.`,
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
            .populate('property', 'title location images rent availableDates landlord bhk')
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
            .populate('property', 'title location rent bhk availableDates images')
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
            .populate('property', 'title location rent bhk availableDates images landlord');
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
        let { status } = req.body; // 'approved' | 'rejected' | 'completed'
        if (status === 'confirmed') status = 'approved';
        const allowedStatuses = ['approved', 'rejected', 'completed', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
        }

        const visit = await Visit.findById(req.params.id)
            .populate({
                path: 'property',
                populate: { path: 'landlord', select: 'firstName lastName' },
            })
            .populate('tenant');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        // Security: Ensure the landlord owns the property for this visit
        if (visit.property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this visit' });
        }

        visit.status = status;
        await visit.save();

        // Notify tenant
        const iconMap = { approved: '✅', rejected: '❌', completed: '🏠' };
        const titleMap = { approved: 'Appointment Approved', rejected: 'Appointment Cancelled/Rejected', completed: 'Visit Completed' };
        const messageMap = {
            approved: `${visit.property.landlord.firstName} ${visit.property.landlord.lastName} has approved your visit for "${visit.property.title}" on ${visit.visitDate} at ${visit.timeSlot}.`,
            rejected: `${visit.property.landlord.firstName} ${visit.property.landlord.lastName} was unable to accept your visit for "${visit.property.title}" on ${visit.visitDate}.`,
            completed: `Your visit to "${visit.property.title}" is marked as completed.`
        };

        await Notification.create({
            user: visit.tenant._id,
            icon: iconMap[status] || '🔔',
            title: titleMap[status] || 'Appointment Update',
            message: messageMap[status] || `Your visit to ${visit.property.title} has been ${status}.`,
        });

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Owner marks selected date unavailable and requests tenant to choose another date
// @route   PATCH /api/visits/:id/reschedule-request
// @access  Private (Landlord)
const requestReschedule = async (req, res) => {
    try {
        const { note, timeSlot } = req.body;
        const visit = await Visit.findById(req.params.id)
            .populate({
                path: 'property',
                populate: { path: 'landlord', select: 'firstName lastName' },
            })
            .populate('tenant');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        // Security: Ensure the landlord owns the property for this visit
        if (visit.property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this visit' });
        }

        const unavailableDate = visit.visitDate;
        if (!visit.unavailableDates) visit.unavailableDates = [];
        if (!visit.unavailableDates.includes(unavailableDate)) {
            visit.unavailableDates.push(unavailableDate);
        }
        if (timeSlot) {
            visit.timeSlot = timeSlot;
        }

        visit.status = 'reschedule_requested';
        visit.ownerNote = note || `Owner is not available on ${unavailableDate} at ${visit.timeSlot || 'the selected time'}. Please choose another date and time from the available options.`;
        await visit.save();

        // Notify tenant
        await Notification.create({
            user: visit.tenant._id,
            icon: '⚠️',
            title: 'Date Not Available - Please Choose Another',
            message: `${visit.property.landlord.firstName} ${visit.property.landlord.lastName} is not available on ${unavailableDate} at ${visit.timeSlot || 'the selected time'} for "${visit.property.title}". Please choose another available date and time.`,
        });

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Tenant selects alternate date after owner requested reschedule
// @route   PATCH /api/visits/:id/select-date
// @access  Private (Tenant)
const selectAlternateDate = async (req, res) => {
    try {
        const { visitDate, timeSlot } = req.body;
        if (!visitDate) {
            return res.status(400).json({ message: 'Please select a visit date.' });
        }
        if (!timeSlot) {
            return res.status(400).json({ message: 'Please select a visit time.' });
        }

        const visit = await Visit.findById(req.params.id).populate({
            path: 'property',
            populate: { path: 'landlord', select: '_id firstName lastName' }
        });
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        if (visit.tenant.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this appointment' });
        }

        visit.visitDate = visitDate;
        if (timeSlot) visit.timeSlot = timeSlot;
        visit.status = 'pending';
        visit.ownerNote = '';
        await visit.save();

        // Notify landlord
        if (visit.property?.landlord?._id) {
            await Notification.create({
                user: visit.property.landlord._id,
                icon: '📅',
                title: 'Alternate Date Selected',
                message: `A tenant selected ${visitDate} at ${visit.timeSlot} for "${visit.property.title}". Please confirm or reject.`,
            });
        }

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reschedule a visit (landlord direct change)
// @route   PATCH /api/visits/:id/reschedule
// @access  Private (Landlord)
const rescheduleVisit = async (req, res) => {
    try {
        const { visitDate, timeSlot } = req.body;
        const visit = await Visit.findById(req.params.id)
            .populate('tenant')
            .populate({
                path: 'property',
                populate: { path: 'landlord', select: 'firstName lastName' },
            });
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        // Security: Ensure the landlord owns the property for this visit
        if (visit.property.landlord.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to reschedule this visit' });
        }

        visit.visitDate = visitDate;
        if (timeSlot) visit.timeSlot = timeSlot;
        visit.status = 'pending';
        await visit.save();

        // Notify tenant
        await Notification.create({
            user: visit.tenant._id,
            icon: '📅',
            title: 'Visit Rescheduled',
            message: `${visit.property.landlord.firstName} ${visit.property.landlord.lastName} updated your visit to "${visit.property.title}" to ${visitDate} at ${timeSlot || visit.timeSlot}.`,
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
                title: 'Appointment Cancelled/Declined',
                message: `A tenant has cancelled/declined their appointment for "${visit.property.title}".`,
            });
        }

        res.json({ message: 'Visit cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookVisit,
    getMyVisits,
    getVisitsForOwner,
    getVisitById,
    updateVisitStatus,
    requestReschedule,
    selectAlternateDate,
    rescheduleVisit,
    cancelVisit
};
